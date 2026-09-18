import pytest
from unittest.mock import patch, mock_open, MagicMock
from scripts.zotero_ingestion_loop import process_pdf, Llama3Model

@patch('scripts.zotero_ingestion_loop.yaml.safe_load')
@patch('scripts.zotero_ingestion_loop.yaml.safe_dump')
@patch('scripts.zotero_ingestion_loop.pdfplumber.open')
@patch('builtins.open', new_callable=mock_open)
@patch('os.path.exists')
def test_process_pdf_updates_manifest(mock_exists, mock_file, mock_pdf_open, mock_yaml_dump, mock_yaml_load):
    # Setup mocks
    mock_exists.return_value = True

    mock_manifest = {
        'metadata': {'context_hashes': []},
        'content_nodes': [],
        'semantic_edges': []
    }
    mock_yaml_load.return_value = mock_manifest

    mock_pdf = MagicMock()
    mock_pdf.metadata = {'Title': 'Test PDF Title'}
    mock_pdf.pages = [MagicMock(extract_text=lambda: 'This is the test text extracted from the pdf.')]
    mock_pdf_open.return_value.__enter__.return_value = mock_pdf

    # Act
    process_pdf('zotero_attachments/test.pdf', manifest_path='pkc_manifest.yml')

    # Assert
    mock_yaml_load.assert_called_once()
    mock_pdf_open.assert_called_once_with('zotero_attachments/test.pdf')

    # Verify the updated manifest object passed to safe_dump
    assert mock_yaml_dump.call_args is not None
    updated_manifest = mock_yaml_dump.call_args[0][0]

    assert len(updated_manifest['content_nodes']) == 1
    node = updated_manifest['content_nodes'][0]
    assert node['title'] == 'Test PDF Title'
    assert node['node_type'] == 'Zotero'
    assert node['epistemic_tag'] == 'hypothetical'

    assert len(updated_manifest['semantic_edges']) == 1
    edge = updated_manifest['semantic_edges'][0]
    assert edge['source_node'] == node['node_uuid']
    assert edge['predicate'] == 'is_supported_by'
