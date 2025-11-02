import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidViewerProps {
  diagrams: { name: string; content: string }[];
}

export default function MermaidViewer({ diagrams }: MermaidViewerProps) {
  const [selectedDiagram, setSelectedDiagram] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          darkMode: true,
          background: '#0f0f1e',
          primaryColor: '#ff00ff',
          primaryTextColor: '#fff',
          primaryBorderColor: '#00ffff',
          lineColor: '#00ffff',
          secondaryColor: '#00ffff',
          tertiaryColor: '#1a1a2e',
        },
      });
      setInitialized(true);
    }
  }, [initialized]);

  useEffect(() => {
    if (initialized && diagrams.length > 0 && diagramRef.current) {
      const renderDiagram = async () => {
        try {
          const diagram = diagrams[selectedDiagram];
          if (!diagram) return;

          // Clear previous diagram
          if (diagramRef.current) {
            diagramRef.current.innerHTML = '';
            const diagramDiv = document.createElement('div');
            diagramDiv.className = 'mermaid';
            diagramDiv.textContent = diagram.content;
            diagramRef.current.appendChild(diagramDiv);
          }

          // Run mermaid
          await mermaid.run({
            nodes: diagramRef.current.querySelectorAll('.mermaid'),
          });
        } catch (error) {
          console.error('Error rendering diagram:', error);
          if (diagramRef.current) {
            diagramRef.current.innerHTML = `
              <div class="alert alert-error">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 class="font-bold">Error Rendering Diagram</h3>
                  <div class="text-sm">${error instanceof Error ? error.message : 'Unknown error'}</div>
                </div>
              </div>
            `;
          }
        }
      };

      renderDiagram();
    }
  }, [initialized, selectedDiagram, diagrams]);

  if (!diagrams || diagrams.length === 0) {
    return (
      <div className="alert alert-info">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-bold">No Diagrams Found</h3>
          <div className="text-sm">
            No Mermaid diagrams are available. Add .mmd files to the /mermaid directory or include Mermaid code blocks in README.md.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Diagram Selector */}
      <div className="flex gap-4 items-center flex-wrap">
        <label className="font-semibold">Select Diagram:</label>
        <div className="tabs tabs-boxed flex-wrap">
          {diagrams.map((diagram, index) => (
            <button
              key={index}
              className={`tab ${selectedDiagram === index ? 'tab-active' : ''}`}
              onClick={() => setSelectedDiagram(index)}
            >
              {diagram.name}
            </button>
          ))}
        </div>
      </div>

      {/* Diagram Display */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h3 className="card-title">{diagrams[selectedDiagram]?.name}</h3>
            <div className="flex gap-2">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  const svg = diagramRef.current?.querySelector('svg');
                  if (svg) {
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const blob = new Blob([svgData], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${diagrams[selectedDiagram]?.name || 'diagram'}.svg`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download SVG
              </button>
            </div>
          </div>
          <div
            ref={diagramRef}
            className="min-h-[400px] flex items-center justify-center overflow-x-auto p-4 bg-base-300 rounded-lg"
          >
            {!initialized && (
              <div className="flex flex-col items-center gap-4">
                <span className="loading loading-spinner loading-lg"></span>
                <p>Loading diagram...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Raw Code */}
      <details className="collapse collapse-arrow bg-base-200">
        <summary className="collapse-title font-medium">
          View Mermaid Code
        </summary>
        <div className="collapse-content">
          <pre className="bg-base-300 p-4 rounded-lg overflow-x-auto">
            <code>{diagrams[selectedDiagram]?.content}</code>
          </pre>
        </div>
      </details>
    </div>
  );
}
