import React, { useState, useEffect } from 'react';
import { Palette, PenTool, Loader, Download } from 'lucide-react';
import { generateImage } from '../../lib/huggingface';

interface GeneratedImage {
  url: string;
  data: ArrayBuffer;
}

export function ArtTherapy() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    const initModel = async () => {
      try {
        await loadModel();
        setModelLoaded(true);
      } catch (err) {
        console.error('Failed to initialize model:', err);
        setError('Model initialization failed. Please try again.');
      }
    };

    initModel();

    return () => {
      if (generatedImage?.url) {
        URL.revokeObjectURL(generatedImage.url);
      }
    };
  }, [generatedImage]);

  const loadModel = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to load model: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modelLoaded) {
      setError('Model not loaded yet. Please wait a moment.');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (generatedImage?.url) {
        URL.revokeObjectURL(generatedImage.url);
      }

      const imageBlob = await generateImage(prompt);
      const arrayBuffer = await imageBlob.arrayBuffer();
      const objectUrl = URL.createObjectURL(imageBlob);

      setGeneratedImage({ url: objectUrl, data: arrayBuffer });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to generate image: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const blob = new Blob([generatedImage.data], { type: 'image/jpeg' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `generated-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <Palette className="h-16 w-16 text-pink-600 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-4xl font-bold mb-4 text-black">Art Therapy</h1>
          <p className="text-xl text-pink-600">Express yourself through AI-generated art</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-pink-100">
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="mb-4">
                <label htmlFor="prompt" className="block text-lg font-medium text-pink-700 mb-2">
                  Enter your prompt
                </label>
                <input
                  type="text"
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you'd like to see..."
                  className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-pink-50/50"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                  loading || !prompt.trim()
                    ? 'bg-pink-300 cursor-not-allowed'
                    : 'bg-pink-600 hover:bg-pink-700'
                } transition-colors shadow-md`}
              >
                {loading ? 'Generating...' : 'Generate Image'}
              </button>
            </form>

            <div className="relative">
              <div
                className="aspect-video bg-pink-50 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden border border-pink-100"
                role="img"
                aria-label={generatedImage ? 'Generated artwork' : 'Empty canvas'}
              >
                {loading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader className="h-12 w-12 text-pink-600 animate-spin" aria-hidden="true" />
                    <p className="text-pink-600 font-medium">
                      {modelLoaded ? 'Creating your masterpiece...' : 'Preparing the canvas...'}
                    </p>
                  </div>
                ) : generatedImage ? (
                  <>
                    <img
                      src={generatedImage.url}
                      alt={`Generated artwork for prompt: ${prompt}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      onClick={handleDownload}
                      className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-pink-600 p-2 rounded-lg shadow-lg transition-colors flex items-center gap-2 backdrop-blur-sm"
                    >
                      <Download className="h-5 w-5" />
                      <span>Save Image</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <PenTool className="h-12 w-12 text-pink-400" aria-hidden="true" />
                    <p className="text-pink-500 font-medium">Your artwork will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 rounded-xl text-red-600 flex items-center gap-2 border border-red-100">
                <span className="font-medium">Error:</span>
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}