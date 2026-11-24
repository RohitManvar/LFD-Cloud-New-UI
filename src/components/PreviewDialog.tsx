import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import Icon from './Icon';
const PreviewContext = createContext<(title: string, description?: string) => void>(() => {});
export const usePreview = () => useContext(PreviewContext);
export function PreviewProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<{ title: string; description?: string } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (item) dialog.current?.showModal(); else dialog.current?.close(); }, [item]);
  return <PreviewContext.Provider value={(title, description) => setItem({ title, description })}>{children}
    <dialog ref={dialog} className="preview-dialog" onCancel={() => setItem(null)} onClick={e => { if (e.target === e.currentTarget) setItem(null); }}>
      <div className="dialog-header"><span className="status-chip updated">Visual preview</span><button className="circle-button" aria-label="Close dialog" onClick={() => setItem(null)}><Icon name="X" /></button></div>
      <h2>{item?.title}</h2><p className="muted">{item?.description || 'This action is shown for design review. Changes are not saved in this preview.'}</p>
      <button className="pill-button dark" onClick={() => setItem(null)}>Back to preview<Icon name="ArrowRight" size={16} /></button>
    </dialog>
  </PreviewContext.Provider>;
}
