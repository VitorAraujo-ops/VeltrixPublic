import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4">
              Veltrix Finance Dashboard
            </h1>
            <p className="text-xl text-purple-200 mb-8">
              Sistema Financeiro Completo
            </p>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-md mx-auto">
              <p className="text-white">
                Aplicação inicializada com sucesso!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
