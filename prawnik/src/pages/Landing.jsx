import { useState, useEffect } from 'react';

export default function Landing() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      if (window.pageYOffset > 80 && showSplash) {
        setShowSplash(false);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showSplash]);

  const scrollToContent = () => {
    setShowSplash(false);
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slides = [
    {
      title: 'Inteligentny matchmaking prawników',
      text: 'Platforma łączy Cię z adwokatem idealnie dopasowanym do Twojego problemu dzięki naszym algorytmom HR + NLP.',
      icon: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=64&q=80'
    },
    {
      title: 'Monitorowanie sprawy w czasie rzeczywistym',
      text: 'Otrzymujesz dynamiczne powiadomienia, kamienie milowe i prognozy zakończenia — zawsze w zasięgu ręki.',
      icon: 'https://img.icons8.com/ios-filled/64/103f7f/clock.png'
    },
    {
      title: 'Elastyczne pakiety cenowe i pełna przejrzystość',
      text: 'Składka terminów, kosztów i wyników jest zawsze dostępna w aplikacji, bez ukrytych opłat.',
      icon: 'https://img.icons8.com/ios-filled/64/103f7f/money.png'
    }
  ];

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length, isHovered]);

  return (
    <div style={{
      fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      color: '#1a1a1a',
      lineHeight: 1.6,
      background: '#f3f6f9'
    }}>
      <style>{`
        @keyframes floatIn { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes glow { 0%, 100% { text-shadow: 0 0 20px rgba(255, 190, 0, 0.8), 0 0 40px rgba(255, 190, 0, 0.4); } 50% { text-shadow: 0 0 10px rgba(255, 190, 0, 0.3); } }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0) rotate(-45deg); } 40% { transform: translateY(10px) rotate(-45deg); } 60% { transform: translateY(6px) rotate(-45deg); } }
        .fancy-hero h1 { animation: floatIn 0.8s ease-out forwards, glow 2.2s ease-in-out infinite alternate; }
        .fancy-hero p { animation: floatIn 0.8s ease-out 0.2s forwards; opacity: 0; }
        .fancy-card { transform: translateY(20px); opacity: 0; animation: floatIn 0.8s ease-out forwards; }
        .fancy-card:nth-child(1) { animation-delay: 0.1s; }
        .fancy-card:nth-child(2) { animation-delay: 0.2s; }
        .fancy-card:nth-child(3) { animation-delay: 0.3s; }

        .slider-container { overflow: hidden; }
        .slider-track { display: grid; grid-template-columns: repeat(3, 1fr); width: 300%; }
        .slide { display: flex; align-items: center; justify-content: center; padding: 48px; background: radial-gradient(circle at top, rgba(18, 48, 104, 0.08), rgba(255, 255, 255, 0)); min-height: 220px; }
        .slide h3 { color: #103f7f; margin: 0 0 8px; }
        .slide p { color: #444; margin: 0; max-width: 80%; }
      `}</style>
      <section className="fancy-hero" style={{
        minHeight: '95vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '80px 24px',
        backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #e6f0ff 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 180,
          backgroundColor: 'rgba(255,255,255,0.98)',
          opacity: showSplash ? 1 : 0,
          visibility: showSplash ? 'visible' : 'hidden',
          transition: 'opacity 0.8s ease, visibility 0.8s ease'
        }}>
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10vh 24px',
          }}>
            <img src="/logo.png" alt="LexConnect" style={{ width: 'clamp(320px, 70vw, 980px)', height: 'auto', marginBottom: '18px', maxWidth: '95vw' }} />
            <h1 style={{ color: '#103f7f', fontSize: 'clamp(42px, 6vw, 72px)', margin: 0, fontWeight: 900 }}>LexConnect</h1>
            <p style={{ marginTop: '12px', color: '#4f6ab1', fontSize: '1.05em' }}>Przewiń w dół, aby rozpocząć</p>
            <div onClick={scrollToContent} style={{ marginTop: '40px', cursor: 'pointer', animation: 'bounce 1.5s infinite' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '24px', border: '3px solid #103f7f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '0', height: '0', borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderTop: '14px solid #103f7f', marginTop: '5px' }} />
              </div>
            </div>
          </div>
        </div>
        <h1 style={{ fontSize: '56px', marginBottom: '18px', fontWeight: 900, color: '#103f7f' }}>Lexconnect</h1>
        <p style={{ fontSize: '20px', color: '#4a4a4a', maxWidth: '720px', margin: '0 auto 24px' }}>
          Najszybsza, najbardziej przejrzysta i skuteczna platforma prawna w Polsce.
          Dostarczamy realne wyniki, nie pustosłowie. Nasza przewaga to technologia, analityka i zespół elitarnych ekspertów.
        </p>
        <p style={{ fontSize: '16px', color: '#6a6a6a', maxWidth: '640px' }}>
          Nie skupiamy się na obietnicach. My je dostarczamy. Jeśli inni dają próbki, my pokazujemy cały proces.
        </p>
      </section>

      <section style={{ padding: '40px 24px', background: '#f8fbff' }}>
        <style>{`
          .slider-container { position: relative; width: 100%; max-width: 1100px; margin: 0 auto; overflow: hidden; border-radius: 20px; box-shadow: 0 16px 35px rgba(0,0,0,0.08); background: #fff; min-height: 260px; }
          .slide { position: absolute; top: 0; left: 0; width: 100%; height: 100%; padding: 24px 32px; background: radial-gradient(circle at top left, rgba(18,48,104,0.08), rgba(255,255,255,0.01)); opacity: 0; transform: scale(0.98); transition: opacity 0.5s ease, transform 0.5s ease; display: flex; justify-content: flex-start; align-items: flex-start; }
          .slide.active { opacity: 1; transform: scale(1); box-shadow: 0 0 0 2px rgba(16,63,127,0.45), 0 0 20px rgba(16,63,127,0.25); }
          .slide-content { text-align: left; max-width: 72%; }
          .slide h3 { color: #103f7f; margin: 0 0 10px; font-size: 1.8rem; }
          .slide p { color: #444; margin: 0; font-size: 1rem; line-height: 1.5; }
        `}</style>
        <div className="slider-container" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          {slides.map((slide, idx) => (
            <div key={idx} className={`slide ${idx === activeSlide ? 'active' : ''}`}>
              {slide.icon && <img src={slide.icon} alt="Ikona slajdu" style={{ width: '42px', height: '42px', marginRight: '14px' }} />}
              <div className="slide-content">
                <h3>{slide.title}</h3>
                <p>{slide.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '40px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', alignItems: 'center' }}>
          <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80" alt="Prawo i technologia" style={{ width: '100%', height: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '18px', border: '1px solid #d6e2f6', boxShadow: '0 12px 28px rgba(22, 45, 84, 0.15)' }} />
          <div>
            <h2 style={{ marginTop: 0, color: '#103f7f' }}>Szybka obsługa w cyfrowym świecie</h2>
            <p style={{ color: '#4a4a4a' }}>Nasza platforma łączy najlepszych prawników z klientami w nowoczesnym modelu online. Każda sprawa trafia do dedykowanego zespołu po natychmiastowej ocenie wstępnej zdjęć dokumentów i AI.</p>
            <p style={{ color: '#4a4a4a' }}>Dzięki temu eliminujemy typowe przestoje i „papierkową robotę”, na którą konkurencja traci czas.</p>
            <p style={{ color: '#4a4a4a' }}>Wprowadzone standardy UX oznaczają, że klient dostaje pełne raporty etapów sprawy, rekomendacje kosztowe oraz automatyczne przypomnienia o terminach. To daje poczucie bezpieczeństwa i kontroli w każdej chwili.</p>
            <ul style={{ color: '#4a4a4a', paddingLeft: '1.2rem' }}>
              <li>Integracja z kalendarzem Google i Outlook w jednym kliknięciu.</li>
              <li>Baza wiedzy dla klientów z gotowymi wzorami dokumentów.</li>
              <li>Dedykowany opiekun sprawy, który prowadzi przypadek od startu do końca.</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1 1 320px', borderRadius: '16px', background: 'white', border: '1px solid #dce5ef', padding: '24px' }}>
            <h2 style={{ marginTop: 0, color: '#103f7f' }}>Dlaczego jesteśmy lepsi</h2>
            <ul style={{ paddingLeft: '1.2rem' }}>
              <li>Elitarna selekcja prawników – tylko 10% kandydatów przechodzi proces weryfikacji.</li>
              <li>Pełna automatyzacja zadań biurowych, która redukuje czas obsługi sprawy do 40%.</li>
              <li>Monitorujemy wygrane i przegrane w czasie rzeczywistym. Twoja sprawa jest pod kontrolą 24/7.</li>
            </ul>
          </div>
          <div style={{ flex: '1 1 320px', borderRadius: '16px', background: 'white', border: '1px solid #dce5ef', padding: '24px' }}>
            <h2 style={{ marginTop: 0, color: '#103f7f' }}>Czego konkurencja nie chce Ci powiedzieć</h2>
            <ul style={{ paddingLeft: '1.2rem' }}>
              <li>Inne serwisy mają ukryte opłaty i czas realizacji 6+ miesięcy.</li>
              <li>Powiększają portfel klientów kosztem jakości usług.</li>
              <li>Brak technologii w zarządzaniu zadaniami = złe terminy i przegapione etapy.</li>
            </ul>
          </div>
          <div style={{ flex: '1 1 320px', borderRadius: '16px', background: 'white', border: '1px solid #dce5ef', padding: '24px' }}>
            <h2 style={{ marginTop: 0, color: '#103f7f' }}>Technologie, które stosujemy</h2>
            <ul style={{ paddingLeft: '1.2rem' }}>
              <li>AI do analizy dokumentów (NLP, rozpoznawanie faktów, predykcja wyniku sprawy).</li>
              <li>Bezpieczne środowisko chmurowe (SLA 99,99%, szyfrowanie end-to-end).</li>
              <li>System rekomendacji prawnika wg specjalizacji + profilu klienta.</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <h2 style={{ marginTop: 0, textAlign: 'center', color: '#103f7f' }}>Rekomendowane ścieżki współpracy</h2>
          <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '20px' }}>
            <div style={{ position: 'relative', height: '220px', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 10px 28px rgba(24, 56, 100, 0.12)' }}>
              <img src="https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=1000&q=80" alt="Adwokat" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)', color: 'white', padding: '14px' }}>
                <h3 style={{ margin: 0 }}>Sprawy karne</h3>
                <p style={{ margin: '5px 0 0', fontSize: '14px' }}>Obrona skuteczna, 100% gotowość na rozprawy.</p>
              </div>
            </div>
            <div style={{ position: 'relative', height: '220px', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 10px 28px rgba(24, 56, 100, 0.12)' }}>
              <img src="https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1000&q=80" alt="Umowa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)', color: 'white', padding: '14px' }}>
                <h3 style={{ margin: 0 }}>Sprawy cywilne</h3>
                <p style={{ margin: '5px 0 0', fontSize: '14px' }}>Dokumenty, umowy, spory prawne — szybkie rozwiązania.</p>
              </div>
            </div>
            <div style={{ position: 'relative', height: '220px', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 10px 28px rgba(24, 56, 100, 0.12)' }}>
              <img src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1000&q=80" alt="Rodzina" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)', color: 'white', padding: '14px' }}>
                <h3 style={{ margin: 0 }}>Sprawy rodzinne</h3>
                <p style={{ margin: '5px 0 0', fontSize: '14px' }}>Mediacja i rozwód w warunkach maksymalnego bezpieczeństwa.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <h2 style={{ marginTop: 0, textAlign: 'center', color: '#103f7f' }}>Kilka liczb, które mówią same za siebie</h2>
          <div style={{ marginTop: '30px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            <div style={{ minWidth: '180px', textAlign: 'center', background: '#101f43', color: 'white', borderRadius: '14px', padding: '20px' }}>
              <p style={{ fontSize: '32px', margin: 0, fontWeight: 700 }}>95%</p>
              <p style={{ margin: '8px 0 0' }}>Satysfakcja klientów</p>
            </div>
            <div style={{ minWidth: '180px', textAlign: 'center', background: '#101f43', color: 'white', borderRadius: '14px', padding: '20px' }}>
              <p style={{ fontSize: '32px', margin: 0, fontWeight: 700 }}>48h</p>
              <p style={{ margin: '8px 0 0' }}>Średni czas pierwszej odpowiedzi</p>
            </div>
            <div style={{ minWidth: '180px', textAlign: 'center', background: '#101f43', color: 'white', borderRadius: '14px', padding: '20px' }}>
              <p style={{ fontSize: '32px', margin: 0, fontWeight: 700 }}>&gt;1000</p>
              <p style={{ margin: '8px 0 0' }}>Wygranych spraw w zeszłym roku</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 24px', background: '#eef5ff' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ marginTop: 0, color: '#103f7f' }}>Kliknij, żeby zacząć</h2>
          <p style={{ color: '#5a5a5a', maxWidth: '680px', margin: '0 auto 24px' }}>
            Jesteśmy gotowi na Twój pierwszy detaliczny brief.
            Jeżeli chcesz, by Twoja sprawa była prowadzona na najwyższym poziomie, to teraz masz dowód: każdy proces, każdy dokument i każdy termin jest monitorowany przez nasz system.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a href="/search" className="btn-gold" style={{ padding: '12px 24px', fontWeight: 700, borderRadius: '999px', background: '#3c6bd0', borderColor: '#3c6bd0' }}>Zobacz prawników</a>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto', background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #d6e2f6' }}>
          <h3 style={{ marginTop: 0, textAlign: 'center', color: '#103f7f' }}>Rekomendacje użytkowników</h3>
          <p style={{ color: '#4a4a4a' }}><strong>„Lexconnect to rewolucja — zlecenie gotowe w 24h, prawnik odpowiada natychmiast, proces transparentny.”</strong> — klient prywatny</p>
          <p style={{ color: '#4a4a4a' }}><strong>„Platforma idealna dla małych firm: jasne ceny, bez opłat dodatkowych, stały monitoring postępów.”</strong> — CEO startupu</p>
        </div>
      </section>

      <footer style={{ padding: '30px 24px', textAlign: 'center', color: '#777' }}>
        <small>© 2026 Lexconnect - Innowacyjne rozwiązania prawne. Fikcyjna firma demo.</small>
      </footer>
    </div>
  );
}
