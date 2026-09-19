import os
import time
import hashlib
import uuid
import yaml
import pdfplumber
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class Llama3Model:
    @staticmethod
    def extract_arguments(text):
        # Simulated extraction from 4-bit Llama-3-8B
        return "Simulated argument extraction from text."

def process_pdf(file_path, manifest_path='pkc_manifest.yml'):
    if not os.path.exists(file_path):
        return

    print(f"Processing PDF: {file_path}")

    # 1. Extract metadata and text
    text_content = ""
    title = "Unknown Document"
    with pdfplumber.open(file_path) as pdf:
        if pdf.metadata and 'Title' in pdf.metadata and pdf.metadata['Title']:
            title = pdf.metadata['Title']
        else:
            title = os.path.basename(file_path)
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_content += page_text + "\n"

    # 2. Simulated model call
    argument = Llama3Model.extract_arguments(text_content)

    # 3. Read YAML manifest
    try:
        with open(manifest_path, 'r') as f:
            manifest = yaml.safe_load(f)
    except FileNotFoundError:
        print(f"Manifest {manifest_path} not found.")
        return

    if manifest is None:
         manifest = {'content_nodes': [], 'semantic_edges': [], 'metadata': {'context_hashes': []}}
    if 'content_nodes' not in manifest:
        manifest['content_nodes'] = []
    if 'semantic_edges' not in manifest:
        manifest['semantic_edges'] = []
    if 'metadata' not in manifest:
        manifest['metadata'] = {'context_hashes': []}
    if 'context_hashes' not in manifest['metadata']:
        manifest['metadata']['context_hashes'] = []

    # Generate new UUIDs
    node_id = f"urn:uuid:{uuid.uuid4()}"
    edge_id = f"urn:uuid:{uuid.uuid4()}"

    # Create new node
    new_node = {
        "node_uuid": node_id,
        "title": title,
        "content_path": file_path,
        "node_type": "Zotero",
        "status": "transient",
        "version_number": 1,
        "epistemic_tag": "hypothetical",
        "meaning_space_anchor": {
            "prototypical_vector": [0.0, 0.0, 0.0, 0.0, 0.0],
            "hyperspherical_radius": 0.05,
            "embedding_model": "text-embedding-3-small"
        },
        "metadata_fields": {
            "epistemic_risk_level": "Medium",
            "architectural_layer": "Pending_Review",
            "implementation_horizon": "TBD"
        }
    }
    manifest['content_nodes'].append(new_node)

    # Find a target node for the edge (defaulting to the first available or a dummy if empty)
    target_node = manifest['content_nodes'][0]['node_uuid'] if manifest['content_nodes'] else "urn:uuid:dummy-target-node"

    # Create new pending edge
    new_edge = {
        "edge_uuid": edge_id,
        "source_node": node_id,
        "target_node": target_node,
        "predicate": "is_supported_by",
        "weight": 0.5,
        "created_by_agent": "system_auto_ingest"
    }
    manifest['semantic_edges'].append(new_edge)

    # Update Context-diff hashes
    try:
        with open(file_path, 'rb') as f:
            sha256 = hashlib.sha256(f.read()).hexdigest()
        manifest['metadata']['context_hashes'].append(f"{file_path}:sha256-{sha256}")
    except Exception as e:
        print(f"Error hashing file: {e}")

    # Rewrite YAML
    with open(manifest_path, 'w') as f:
        yaml.safe_dump(manifest, f, default_flow_style=False)

    print(f"Successfully processed and added {title} to {manifest_path}")

class PDFHandler(FileSystemEventHandler):
    def __init__(self, manifest_path='pkc_manifest.yml'):
        self.manifest_path = manifest_path

    def on_created(self, event):
        if not event.is_directory and event.src_path.lower().endswith(".pdf"):
            print(f"New PDF detected: {event.src_path}")
            # Slight delay to ensure file is fully written before reading
            time.sleep(1)
            process_pdf(event.src_path, self.manifest_path)

def main():
    watch_directory = "zotero_attachments"
    if not os.path.exists(watch_directory):
        os.makedirs(watch_directory)

    event_handler = PDFHandler()
    observer = Observer()
    observer.schedule(event_handler, path=watch_directory, recursive=False)

    print(f"Starting Zotero ingestion loop. Watching '{watch_directory}' for new PDFs...")
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    main()
