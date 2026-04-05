import { useEffect, useState } from 'react';

/*
 * Участник 2: Детектор устройства
 * Если iPhone - дороже, если Android - дешевле.
 */

export default function DeviceDetector() {
  const [device, setDevice] = useState('unknown');

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) setDevice('ios');
    else if (/Android/.test(ua)) setDevice('android');
    else setDevice('desktop');
  }, []);

  return (
    <div className="card device-detector" style={{ marginTop: '1rem', textAlign: 'center', background: 'var(--bg-secondary)' }}>
      {device === 'ios' && <p style={{ color: 'red' }}>🍎 Ого, у вас iPhone! Поездка будет дороже на 20%.</p>}
      {device === 'android' && <p style={{ color: 'green' }}>🤖 У вас Android. Вам и так несладко, дадим скидку 10%.</p>}
      {device === 'desktop' && <p style={{ color: 'var(--text-secondary)' }}>💻 Заказывать такси с ПК? Вы странный. Наценки не будет.</p>}
    </div>
  );
}
