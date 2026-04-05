import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRideStore } from '../../store/rideStore';

/*
 * =============================================
 *  РУЛЕТКА ВОДИТЕЛЕЙ (CS:GO стайл)
 *  Водители разбиты по редкостям с отсылками
 * =============================================
 */

const RARITIES = {
  consumer: { label: 'Ширпотреб', color: '#b0c3d9', gradient: 'linear-gradient(135deg, #1f2326, #2d3238)', emoji: '🚕' },
  milspec: { label: 'Армейское качество', color: '#4b69ff', gradient: 'linear-gradient(135deg, #111a33, #1c2b59)', emoji: '🚙' },
  restricted: { label: 'Запрещенное', color: '#8847ff', gradient: 'linear-gradient(135deg, #1e0e38, #301759)', emoji: '🚗' },
  classified: { label: 'Засекреченное', color: '#d32ce6', gradient: 'linear-gradient(135deg, #300836, #4d0d57)', emoji: '🚐' },
  covert: { label: 'Тайное', color: '#eb4b4b', gradient: 'linear-gradient(135deg, #380e0e, #591616)', emoji: '🏎️' },
  gold: { label: 'Редчайшее (Тот самый)', color: '#ffd700', gradient: 'linear-gradient(135deg, #382d00, #594700)', emoji: '👑' },
};

const DRIVER_DB = [
  // Consumer (Ширпотреб)
  { name: 'Шохрух на Нексии', rarity: 'consumer', speed: 12, silence: 2, multiplier: 0.8, image: '/drivers/asian.png', hue: 0 },
  { name: 'Умедджон (Вёз маму)', rarity: 'consumer', speed: 10, silence: 0, multiplier: 0.7, image: '/drivers/asian2.png', hue: 0 },
  { name: 'Дилшод (Без прав)', rarity: 'consumer', speed: 15, silence: 1, multiplier: 0.6, image: '/drivers/asian3.png', hue: 0 },
  { name: 'Алишерчик', rarity: 'consumer', speed: 14, silence: 2, multiplier: 0.8, image: '/drivers/asian.png', hue: 135 },
  { name: 'Фаррух (Без ВНЖ)', rarity: 'consumer', speed: 16, silence: 1, multiplier: 0.5, image: '/drivers/asian2.png', hue: 45 },
  { name: 'Бободжон (На связи)', rarity: 'consumer', speed: 13, silence: 0, multiplier: 0.75, image: '/drivers/asian3.png', hue: 30 },
  { name: 'Джамшед (Заблудился)', rarity: 'consumer', speed: 11, silence: 3, multiplier: 0.85, image: '/drivers/asian.png', hue: 270 },
  { name: 'Толиб (2 смены подряд)', rarity: 'consumer', speed: 17, silence: 1, multiplier: 0.65, image: '/drivers/asian2.png', hue: 315 },
  { name: 'Нурлан (В другой двор)', rarity: 'consumer', speed: 9, silence: 4, multiplier: 0.9, image: '/drivers/asian3.png', hue: 60 },
  { name: 'Баха (Слушает музыку)', rarity: 'consumer', speed: 14, silence: 0, multiplier: 0.7, image: '/drivers/asian.png', hue: 120 },
  { name: 'Тимур (Не туда нажал)', rarity: 'consumer', speed: 8, silence: 5, multiplier: 0.8, image: '/drivers/asian2.png', hue: 240 },
  { name: 'Сардор (В пробке)', rarity: 'consumer', speed: 5, silence: 6, multiplier: 0.95, image: '/drivers/asian3.png', hue: 100 },

  // Milspec (Армейское) - Переходные
  { name: 'Мага (Кавказ ФМ)', rarity: 'milspec', speed: 18, silence: 0, multiplier: 0.9, image: '/drivers/caucasian.png', hue: 0 },
  { name: 'Арсен (Солярис)', rarity: 'milspec', speed: 12, silence: 2, multiplier: 0.9, image: '/drivers/caucasian2.png', hue: 0 },
  { name: 'Рустам (Брат брату)', rarity: 'milspec', speed: 10, silence: 5, multiplier: 1.0, image: '/drivers/caucasian.png', hue: 90 },
  { name: 'Ислам (Приора)', rarity: 'milspec', speed: 20, silence: 1, multiplier: 0.8, image: '/drivers/caucasian2.png', hue: 135 },
  { name: 'Аслан (Суетолог)', rarity: 'milspec', speed: 22, silence: 0, multiplier: 0.75, image: '/drivers/caucasian.png', hue: 180 },
  { name: 'Шамиль (Шашки)', rarity: 'milspec', speed: 25, silence: 2, multiplier: 0.7, image: '/drivers/caucasian2.png', hue: 225 },
  { name: 'Тимур (Чёткий)', rarity: 'milspec', speed: 16, silence: 4, multiplier: 0.95, image: '/drivers/caucasian.png', hue: 270 },

  // Restricted (Запрещенное) - Славяне начального уровня
  { name: 'Александр', rarity: 'restricted', speed: 8, silence: 6, multiplier: 1.2, image: '/drivers/slavic.png', hue: 0 },
  { name: 'Серёга (Радио Дача)', rarity: 'restricted', speed: 7, silence: 7, multiplier: 1.1, image: '/drivers/slavic2.png', hue: 0 },
  { name: 'Лёха (Ворчит)', rarity: 'restricted', speed: 9, silence: 2, multiplier: 1.15, image: '/drivers/slavic.png', hue: 90 },
  { name: 'Михалыч (Бывалый)', rarity: 'restricted', speed: 6, silence: 5, multiplier: 1.3, image: '/drivers/slavic2.png', hue: 30 },
  { name: 'Вася (С похмелья)', rarity: 'restricted', speed: 11, silence: 8, multiplier: 1.0, image: '/drivers/slavic.png', hue: 180 },

  // Classified (Засекреченное)
  { name: 'Виталий (Знает дорогу)', rarity: 'classified', speed: 6, silence: 8, multiplier: 1.5, image: '/drivers/slavic2.png', hue: 45 },
  { name: 'Антон (Кондиционер)', rarity: 'classified', speed: 5, silence: 9, multiplier: 1.7, image: '/drivers/slavic.png', hue: 270 },
  { name: 'Дмитрий (Бизнесмен)', rarity: 'classified', speed: 5, silence: 10, multiplier: 2.0, image: '/drivers/businessman.png', hue: 0 },
  { name: 'Олег (Инвестор)', rarity: 'classified', speed: 4, silence: 10, multiplier: 2.1, image: '/drivers/businessman.png', hue: 45 },

  // Covert (Тайное)
  { name: 'Иван (Молчаливый)', rarity: 'covert', speed: 5, silence: 10, multiplier: 2.5, image: '/drivers/silent.png', hue: 0 },
  { name: 'Илья (Вода в салоне)', rarity: 'covert', speed: 4, silence: 10, multiplier: 2.8, image: '/drivers/covert2.png', hue: 0 },
  { name: 'Евгений (Открыл дверь)', rarity: 'covert', speed: 4, silence: 10, multiplier: 3.0, image: '/drivers/silent.png', hue: 90 },

  // Gold (Нож)
  { name: 'Ярослав Мудрый', rarity: 'gold', speed: 100, silence: 10, multiplier: 5.0, image: '/drivers/yaroslav.png', hue: 0 },
  { name: 'Добрыня Никитич (Maybach)', rarity: 'gold', speed: 100, silence: 10, multiplier: 6.0, image: '/drivers/dobrynya.png', hue: 0 },
  { name: 'Илья Муромец (Aurus)', rarity: 'gold', speed: 100, silence: 10, multiplier: 7.0, image: '/drivers/dobrynya.png', hue: 45 },
];

const FUNNY_DESCRIPTIONS = [
  "Машина пахнет как бабушкин ковер, но довезет с ветерком.",
  "Называет навигатор 'шайтан-машиной'.",
  "Слушает шансон на громкости, от которой трясутся окна.",
  "Обещает 'покажу короткий путь', но едет через соседний город.",
  "В салоне висит 15 ароматизаторов 'Елочка'.",
  "Молчит, но тяжело вздыхает на каждом светофоре.",
  "Машина грязная, зато душа чистая.",
  "Любит поговорить про геополитику и рептилоидов.",
  "Очки как у терминатора, взгляд как у снайпера."
];

const ACHIEVEMENTS = [
  "Мастер дрифта на Солярисе",
  "Выжил после поездки в Бутово",
  "Знает где камеры",
  "Разговаривает по скайпу за рулем 3 часа",
  "Победитель Яндекс.Про 2022",
  "3 дня без сна",
  "Срезал через газон",
  "Ушел от погони"
];

function generateStrip() {
  const strip = [];
  // Generate 80 items so we have a long tail to spin through
  for (let i = 0; i < 80; i++) {
    const r = Math.random();
    let tier = 'consumer';
    
    // Weighted probabilities
    if (r > 0.60) tier = 'milspec';
    if (r > 0.80) tier = 'restricted';
    if (r > 0.93) tier = 'classified';
    if (r > 0.98) tier = 'covert';
    if (r > 0.995) tier = 'gold'; // 0.5% chance for a knife level driver
    
    const candidates = DRIVER_DB.filter(d => d.rarity === tier);
    const driver = candidates[Math.floor(Math.random() * candidates.length)];
    
    // Add random mock stats
    const enrichedDriver = { 
      ...driver, 
      id: `item-${i}-${Date.now()}`,
      description: FUNNY_DESCRIPTIONS[Math.floor(Math.random() * FUNNY_DESCRIPTIONS.length)],
      experience: `${Math.floor(Math.random() * 30) + 1} лет`,
      stats: {
        aggression: Math.floor(Math.random() * 100),
        talkativity: Math.floor(Math.random() * 100),
        musicVolume: Math.floor(Math.random() * 100),
      },
      achievements: Array.from({length: 2}, () => ACHIEVEMENTS[Math.floor(Math.random() * ACHIEVEMENTS.length)])
    };
    
    strip.push(enrichedDriver);
  }
  return strip;
}

export default function DriverRoulette({ onResult }) {
  const navigate = useNavigate();
  const [strip, setStrip] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState(null);
  const [rollDistance, setRollDistance] = useState(0);
  
  const containerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const lastTickItemRef = useRef(-1);

  const ITEM_WIDTH = 150;
  const ITEM_MARGIN = 8;
  const FULL_ITEM_WIDTH = ITEM_WIDTH + ITEM_MARGIN;

  useEffect(() => {
    setStrip(generateStrip());
  }, []);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playTickSound = () => {
    const actx = audioCtxRef.current;
    if (!actx || actx.state !== 'running') return;

    const osc = actx.createOscillator();
    const gainNode = actx.createGain();

    // Sharp tick sound
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, actx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, actx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.15, actx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.05);

    osc.connect(gainNode);
    gainNode.connect(actx.destination);

    osc.start();
    osc.stop(actx.currentTime + 0.05);
  };

  const spin = () => {
    initAudio();
    if (spinning || !containerRef.current) return;
    setSpinning(true);
    setFinished(false);
    lastTickItemRef.current = -1; // Reset tick tracker

    // We will land around index 65-70
    const targetIndex = 65 + Math.floor(Math.random() * 5);
    const targetDriver = strip[targetIndex];
    setWinner(targetDriver);

    const containerWidth = containerRef.current.offsetWidth;
    // Calculate exact pixel offset.
    // Center of target item = targetIndex * FULL_ITEM_WIDTH + (ITEM_WIDTH / 2)
    const targetCenter = targetIndex * FULL_ITEM_WIDTH + (ITEM_WIDTH / 2);
    
    // Calculate random jitter within the item block so it doesn't always land exactly in the center
    const randomJitter = (Math.random() * (ITEM_WIDTH - 20)) - ((ITEM_WIDTH - 20) / 2);
    
    // The final offset to shift the container by
    const finalOffset = targetCenter - (containerWidth / 2) + randomJitter;
    setRollDistance(finalOffset);

    // Provide a dramatic wait time
    setTimeout(() => {
      setFinished(true);
      // Wait for user to accept/decline!
    }, 6000);
  };

  if (finished && winner) {
    const meta = RARITIES[winner.rarity];
    return (
      <div 
        className="card" 
        style={{ 
          textAlign: 'center', 
          borderColor: meta.color, 
          boxShadow: `0 0 30px ${meta.color}88`,
          background: meta.gradient,
          animation: 'popIn 0.5s ease-out'
        }}
      >
        <style>{`
          @keyframes popIn {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
        <p style={{ color: meta.color, fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {meta.label}
        </p>
        <img 
          src={winner.image} 
          alt={winner.name} 
          style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: `3px solid ${meta.color}`, margin: '1rem auto', filter: `hue-rotate(${winner.hue || 0}deg)` }}
        />
        <h3 style={{ color: '#fff', textShadow: `1px 1px 2px #000` }}>
          ★ {winner.name}
        </h3>
        
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '8px', marginTop: '1rem', textAlign: 'left', fontSize: '0.9rem' }}>
          <p style={{ marginBottom: '0.5rem' }}><strong>📝 Описание:</strong> {winner.description}</p>
          <p style={{ marginBottom: '0.5rem' }}><strong>⏳ Стаж:</strong> {winner.experience}</p>
          <p style={{ marginBottom: '0.2rem' }}><strong>📊 Характеристики:</strong></p>
          <ul style={{ paddingLeft: '1.2rem', marginBottom: '0.5rem', listStyleType: 'disc' }}>
            <li>Агрессия: 💥 {winner.stats.aggression}/100</li>
            <li>Разговорчивость: 🗣 {winner.stats.talkativity}/100</li>
            <li>Громкость шансона: 🔊 {winner.stats.musicVolume}/100</li>
          </ul>
          <p><strong>🏅 Достижения:</strong> {winner.achievements.join(', ')}</p>
        </div>

        <p style={{ fontSize: '1.4rem', color: '#00ff00', fontWeight: 'bold', marginTop: '1rem' }}>
          💰 Цена поездки: {useRideStore.getState().finalPrice} ₽
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexDirection: 'column' }}>
          <button className="btn btn-primary" style={{ background: '#28a745', borderColor: '#28a745', padding: '1rem' }} onClick={() => onResult?.(winner)}>
            ✅ Принять поездку
          </button>
          <button className="btn btn-secondary" style={{ background: '#dc3545', borderColor: '#dc3545', color: '#fff', padding: '0.8rem' }} onClick={() => navigate('/sudoku')}>
            ❌ Отказаться (Играть в Судоку)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="card" 
      style={{ 
        padding: '1.5rem', 
        background: '#181b1f', 
        border: '2px solid #333',
        width: '95vw',
        maxWidth: '900px',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)'
      }}
    >
      <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#ddd', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '2px' }}>
        Открытие кейса "Yandex Collection"
      </p>
      
      {/* The Roulette Box Container */}
      <div 
        ref={containerRef}
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '160px', 
          background: '#0d1012', 
          boxShadow: 'inset 0 0 20px #000',
          border: '1px solid #000',
          overflow: 'hidden' 
        }}
      >
        {/* Glow effect in the center */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '50%',
          width: '80px', transform: 'translateX(-50%)',
          background: 'linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.1) 50%, rgba(255,255,255,0))',
          pointerEvents: 'none', zIndex: 1
        }} />
        
        {/* The Orange line in the middle */}
        <div style={{ 
          position: 'absolute', 
          top: 0, bottom: 0, left: '50%', 
          width: '2px', 
          background: '#e0a526', 
          boxShadow: '0 0 10px #e0a526',
          zIndex: 10, 
          transform: 'translateX(-50%)' 
        }} />
        
        {strip.length > 0 && (
          <motion.div
            style={{ display: 'flex', height: '100%', alignItems: 'center' }}
            animate={spinning ? { x: -rollDistance } : { x: 0 }}
            transition={{ type: "tween", ease: [0.1, 0.7, 0.1, 1], duration: 5.5 }}
            onUpdate={(latest) => {
              if (latest.x !== undefined && spinning) {
                const absoluteX = Math.abs(latest.x);
                // Calculate which item we are currently shifting past
                const crossedItem = Math.floor(absoluteX / FULL_ITEM_WIDTH);
                if (crossedItem > lastTickItemRef.current) {
                  lastTickItemRef.current = crossedItem;
                  playTickSound();
                }
              }
            }}
          >
            {strip.map((driver) => {
              const rInfo = RARITIES[driver.rarity];
              return (
                <div 
                  key={driver.id} 
                  style={{ 
                    minWidth: `${ITEM_WIDTH}px`, 
                    height: '130px', 
                    background: rInfo.gradient, 
                    borderBottom: `6px solid ${rInfo.color}`, 
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5), 0 5px 10px rgba(0,0,0,0.4)',
                    marginRight: `${ITEM_MARGIN}px`, 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ fontSize: '0.65rem', color: rInfo.color, position: 'absolute', top: '6px', left: '6px', textTransform: 'uppercase', zIndex: 5, background: 'rgba(0,0,0,0.6)', padding: '2px 4px', borderRadius: '4px' }}>
                    {rInfo.label.split(' ')[0]}
                  </div>
                  
                  <img src={driver.image} alt={driver.name} style={{ width: '85px', height: '85px', objectFit: 'cover', borderRadius: '50%', border: `2px solid ${rInfo.color}`, zIndex: 2, filter: `drop-shadow(0 0 5px ${rInfo.color}) hue-rotate(${driver.hue || 0}deg)`, marginTop: '10px' }} />
                  
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#fff', 
                    textAlign: 'center', 
                    padding: '0 4px', 
                    marginTop: '0.5rem',
                    textShadow: '1px 1px 2px #000',
                    zIndex: 2,
                    fontWeight: 'bold'
                  }}>
                    {driver.name}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>

      {!spinning && (
        <button 
          className="btn btn-primary" 
          onClick={spin} 
          style={{ 
            width: '100%', 
            marginTop: '1.5rem', 
            background: '#e0a526', 
            color: '#111', 
            border: 'none', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', 
            letterSpacing: '1px',
            boxShadow: '0 0 15px rgba(224, 165, 38, 0.4)'
          }}
        >
          Открыть кейс "Водители" (Бесплатно)
        </button>
      )}
    </div>
  );
}
