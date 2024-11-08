import { useEffect, useState } from 'react';
import { Brain, Loader2, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';

interface Column {
  name: string;
  type: 'categorical';
  options: string[];
}

interface DataRow {
  [key: string]: string;
  'Self-care tips that might help you out': string;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
    </div>
  );
}

export default function QuickSuggestions() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mlData, setMlData] = useState<DataRow[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const form = useForm({
    defaultValues: {},
    mode: 'onChange'
  });

  const { watch, formState: { isValid } } = form;
  const formValues = watch();

  useEffect(() => {
    // Check if all fields have values
    const allFieldsFilled = columns.every(column => formValues[column.name]?.trim());
    setIsFormValid(allFieldsFilled);
  }, [formValues, columns]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data.csv');
        const csvText = await response.text();
        
        const parsedData = Papa.parse(csvText, { 
          header: true,
          skipEmptyLines: true,
          transform: (value) => value.trim()
        });
        
        const data = parsedData.data as DataRow[];
        setMlData(data);
        
        if (!data.length) {
          throw new Error('No data found');
        }

        const headers = Object.keys(data[0]).filter(header => 
          header !== 'Self-care tips that might help you out'
        );
        
        const columnInfo = headers.map(colname => {
          const uniqueValues = new Set<string>();
          for (const row of data) {
            if (row[colname]) uniqueValues.add(row[colname]);
          }
          
          return {
            name: colname,
            type: 'categorical' as const,
            options: Array.from(uniqueValues).sort()
          };
        });

        setColumns(columnInfo);
        
        const defaultValues: Record<string, string> = {};
        columnInfo.forEach((column: Column) => {
          defaultValues[column.name] = "";
        });

        form.reset(defaultValues);
      } catch (err) {
        setError('Failed to load form data');
        console.error('Error loading data:', err);
      }
    };

    loadData();
  }, []);

  const findBestMatch = (userInput: Record<string, string>): DataRow | null => {
    const validInputs = Object.entries(userInput).filter(([_, value]) => value.trim());
    
    if (validInputs.length === 0) return null;

    let bestMatches: DataRow[] = [];
    let highestScore = 0;
    
    const totalFields = validInputs.length;
    
    for (const row of mlData) {
      let score = 0;
      
      for (const [key, value] of validInputs) {
        if (row[key] === value) {
          score++;
        }
      }
      
      const normalizedScore = score / totalFields;
      
      if (normalizedScore > highestScore) {
        highestScore = normalizedScore;
        bestMatches = [row];
      } else if (normalizedScore === highestScore) {
        bestMatches.push(row);
      }
    }
    
    if (bestMatches.length === 0) return null;
    
    // Sort matches by a consistent criterion instead of random selection
    return bestMatches.sort((a, b) => {
      // First sort by the recommendation text
      const tipA = a['Self-care tips that might help you out'];
      const tipB = b['Self-care tips that might help you out'];
      
      // Compare the tips lexicographically
      return tipA.localeCompare(tipB);
    })[0]; // Take the first match after sorting
  };

  const onSubmit = async (values: Record<string, string>) => {
    setLoading(true);
    setPrediction(null);
    setError(null);

    try {
      const bestMatch = findBestMatch(values);
      
      if (!bestMatch) {
        setError('No matching recommendations found. Please try different selections.');
        return;
      }
      
      setPrediction(bestMatch['Self-care tips that might help you out']);
    } catch (err) {
      setError('Failed to generate recommendation');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (columns.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white to-purple-50 pt-20">
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-purple-900">Quick Self-Care Tips</h1>
          </div>
          <p className="text-purple-700 mb-6">Loading your personalized experience...</p>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-purple-50 pt-20">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
        <Link 
          to="/therapy" 
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Therapy Options
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-purple-900">Quick Self-Care Tips</h1>
          </div>
          <p className="text-purple-700">Answer these questions to get personalized self-care recommendations.</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {columns.map((column) => (
            <div key={column.name} className="space-y-2">
              <label className="block text-sm font-medium text-purple-800">
                {column.name}
              </label>
              <select
                {...form.register(column.name, { required: true })}
                className="w-full px-3 py-2 bg-white border border-purple-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select an option</option>
                {column.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
          
          <button 
            type="submit" 
            disabled={loading || !isFormValid}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Get Recommendation
          </button>
        </form>

        {(prediction || error) && (
          <div className={`mt-6 p-4 rounded-lg ${error ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-purple-50 border border-purple-200 text-purple-800'}`}>
            <h3 className="font-semibold mb-2">
              {error ? 'Error' : 'Recommended Self-Care Tip'}
            </h3>
            <p>{error || prediction}</p>
          </div>
        )}
      </div>
    </div>
  );
}