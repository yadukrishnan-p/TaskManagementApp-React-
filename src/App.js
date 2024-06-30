
import './App.css';
import Todo from './Todo';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <div className="container">
       <ToastContainer theme='dark' position='top-right'/>
      <Todo/>
    </div>
  );
}

export default App;
