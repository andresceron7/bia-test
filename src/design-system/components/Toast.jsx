import {createContext, useCallback, useContext, useRef, useState} from 'react';
import {IconCircleCheck, IconClose, IconInfo} from '../icons';

const ToastContext = createContext(() => {});

/** Confirmaciones breves y no bloqueantes, anunciadas a lectores de pantalla. */
export function ToastProvider({children}) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback(id => setToasts(list => list.map(t => (t.id === id ? {...t, leaving: true} : t))), []);
  const remove = useCallback(id => setToasts(list => list.filter(t => t.id !== id)), []);

  const notify = useCallback(
    (message, {tone = 'success', duration = 6000} = {}) => {
      const id = ++nextId.current;
      setToasts(list => [...list.slice(-2), {id, message, tone}]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="ds-toasts" role="status" aria-live="polite">
        {toasts.map(t => {
          const Icon = t.tone === 'success' ? IconCircleCheck : IconInfo;
          return (
            <div
              key={t.id}
              className={`ds-toast ds-toast--${t.tone}`}
              data-leaving={t.leaving || undefined}
              onAnimationEnd={() => t.leaving && remove(t.id)}
            >
              <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
              <span>{t.message}</span>
              <button type="button" aria-label="Cerrar aviso" onClick={() => dismiss(t.id)}>
                <IconClose size={16} strokeWidth={1.8} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
