import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

// Custom Icons
const driverIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048314.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const createPokeIcon = (url) => new L.Icon({
  iconUrl: url,
  iconSize: [45, 45],
  iconAnchor: [22, 22],
});

const pikachuIcon = createPokeIcon('/pokemons/pikachu.png');
const charmanderIcon = createPokeIcon('/pokemons/charmander.png');
const squirtleIcon = createPokeIcon('/pokemons/squirtle.png');

const getAddressCoords = (addrText) => {
  if (!addrText) return [37.61, 55.75]; // Moscow center

  if (addrText.includes('Амстердам')) {
    return [4.895168, 52.370216]; // Amsterdam [lon, lat]
  }
  if (addrText.includes('Шереметьево')) {
    return [37.4146, 55.9726]; // Sheremetyevo Airport
  }

  let hash = 0;
  for (let i = 0; i < addrText.length; i++) {
    hash = addrText.charCodeAt(i) + ((hash << 5) - hash);
  }
  const lat = 55.6 + (Math.abs(hash) % 300) / 1000;
  const lon = 37.4 + (Math.abs(hash >> 2) % 400) / 1000;
  return [lon, lat]; // GeoJSON expects [lon, lat]
};

export default function PokemonMap({ address, toAddress, phase, onArrival }) {
  const [routeCoords, setRouteCoords] = useState([]);
  const [driverPos, setDriverPos] = useState([55.75, 37.61]); 
  const [pokemons, setPokemons] = useState([]);
  const [caught, setCaught] = useState(0);
  const mapRef = useRef(null);
  
  const totalPokemons = phase === 'riding' ? 3 : 0;

  useEffect(() => {
    // Сброс состояния для новой фазы
    setCaught(0);
    setRouteCoords([]);
    setPokemons([]);

    const [userLon, userLat] = getAddressCoords(address);
    const start = phase === 'waiting' ? [userLon + 0.03, userLat + 0.03] : [userLon, userLat];
    const end = phase === 'waiting' ? [userLon, userLat] : getAddressCoords(toAddress);

    let url = '';
    let pokesSpawn = [];
    if (phase === 'riding') {
      const distLon = end[0] - start[0];
      const distLat = end[1] - start[1];
      // Рандомизируем точки на пути (чтобы водитель ДЕЛАЛ КРЮК)
      const wp1 = [start[0] + distLon * 0.25 + (Math.random() - 0.5) * 0.04, start[1] + distLat * 0.25 + (Math.random() - 0.5) * 0.04];
      const wp2 = [start[0] + distLon * 0.50 + (Math.random() - 0.5) * 0.04, start[1] + distLat * 0.50 + (Math.random() - 0.5) * 0.04];
      const wp3 = [start[0] + distLon * 0.75 + (Math.random() - 0.5) * 0.04, start[1] + distLat * 0.75 + (Math.random() - 0.5) * 0.04];
      
      pokesSpawn = [
        { id: 1, pos: [wp1[1], wp1[0]], caught: false, icon: pikachuIcon, name: 'Пикачу' },
        { id: 2, pos: [wp2[1], wp2[0]], caught: false, icon: charmanderIcon, name: 'Чармандер' },
        { id: 3, pos: [wp3[1], wp3[0]], caught: false, icon: squirtleIcon, name: 'Сквиртл' }
      ];

      // Строим маршрут ЧЕРЕЗ покемонов (заставляем OSRM удлинить маршрут)
      url = `http://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${wp1[0]},${wp1[1]};${wp2[0]},${wp2[1]};${wp3[0]},${wp3[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;
    } else {
      url = `http://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;
    }

    let animationId = null;
    let isCancelled = false;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (isCancelled) return;
        if (data.routes && data.routes[0]) {
          const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setRouteCoords(coords);
          
          if (coords.length > 0) {
            setDriverPos(coords[0]);
          }

          if (phase === 'riding') {
            setPokemons(pokesSpawn);
          }

          animationId = startSimulation(coords, isCancelled);
        } else {
          // Fallback if no route
          onArrival?.();
        }
      })
      .catch(err => {
        console.error(err);
        onArrival?.();
      });

    return () => {
      isCancelled = true;
    };
  }, [phase, address, toAddress]);

  const startSimulation = (coords, isCancelled) => {
    let currentStep = 0;
    
    // Функция проверки поимки
    const checkPokemons = (currentLat, currentLon) => {
      if (phase !== 'riding') return;

      setPokemons(prev => {
        let newCaughtCount = 0;
        const updated = prev.map(p => {
          if (p.caught) {
            newCaughtCount++;
            return p;
          }
          const dist = Math.sqrt(Math.pow(p.pos[0] - currentLat, 2) + Math.pow(p.pos[1] - currentLon, 2));
          if (dist < 0.005) { // радиус поимки
            newCaughtCount++;
            return { ...p, caught: true };
          }
          return p;
        });
        
        setCaught(prevCaught => {
          if (newCaughtCount > prevCaught) {
            return newCaughtCount;
          }
          return prevCaught;
        });

        return updated;
      });
    };

    const animate = () => {
      if (isCancelled) return;
      
      if (currentStep < coords.length) {
        const [lat, lon] = coords[currentStep];
        setDriverPos([lat, lon]);
        checkPokemons(lat, lon);
        
        if (currentStep % 10 === 0 && mapRef.current) {
          mapRef.current.panTo([lat, lon], { animate: true, duration: 0.5 });
        }

        currentStep += 1;
        // Нормальная скорость (реализм)
        setTimeout(() => requestAnimationFrame(animate), 250);
      } else {
        // Доехали до конца
        onArrival?.();
      }
    };
    
    requestAnimationFrame(animate);
    return true; // Used to identify animation started
  };

  const centerCoords = routeCoords.length > 0 ? routeCoords[0] : [55.75, 37.61];

  return (
    <div className="card pokemon-map" style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          {phase === 'waiting' ? 'Водитель едет к вам...' : 'Вы едете... Водитель собирает покемонов по пути.'}
        </p>
        
        {phase === 'riding' && (
          <p style={{ margin: 0, fontSize: '1rem', color: 'var(--accent)', fontWeight: 'bold' }}>
            Собрано: {caught} / {totalPokemons}
          </p>
        )}
      </div>

      <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--accent)' }}>
        <MapContainer 
          key={phase} // Force re-render map container when phase changes to reset bounds easily
          center={centerCoords} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* Маршрут */}
          {routeCoords.length > 0 ? (
            <Polyline positions={routeCoords} color="var(--accent)" weight={4} dashArray="5, 10" />
          ) : null}

          {/* Водитель */}
          <Marker position={driverPos} icon={driverIcon} zIndexOffset={100} />

          {/* Покемоны в фазе поездки */}
          {phase === 'riding' ? pokemons.filter(p => !p.caught).map(poke => (
            <Marker key={poke.id} position={poke.pos} icon={poke.icon}>
              <Popup>{poke.name}</Popup>
            </Marker>
          )) : null}

          {/* Точка прибытия */}
          {routeCoords.length > 0 ? (
            <Marker position={routeCoords[routeCoords.length - 1]}>
              <Popup>{phase === 'waiting' ? 'Вы здесь' : 'Место назначения'}</Popup>
            </Marker>
          ) : null}

        </MapContainer>
      </div>
    </div>
  );
}
