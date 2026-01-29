# Projekt_na_semestr
<p>
3.LexConnect(Legal Marketplace & Case Management)

1. Architektura Systemu (Kluczowe moduły)
A. Moduł Klienta (Frontend Publiczny)
  I. Wyszukiwarka z filtrami: Szukanie po specjalizacji (np. prawo spadkowe, karne), lokalizacji (mapa) oraz formie pomocy (online/stacjonarnie).
    - Kreator Zlecenia (Intake Form): Zamiast pisać maila, klient wypełnia ustrukturyzowany formularz:
      -Typ sprawy (np. pozew o zapłatę).
      -Opis stanu faktycznego.
      -Bezpieczny upload plików (skany pism, umowy).
      -Budżet (widełki cenowe lub zapytanie o wycenę).
  II. Profil Prawnika: Opinie, biogram, cennik za standardowe porady oraz licznik "sukcesów" (jeśli prawo korporacyjne na to pozwala w danej jurysdykcji).
    B. Moduł Prawnika (Panel Zarządzania)
    -Tablica Ofert (Lead Management): Widok spraw "oczekujących". Prawnik widzi skrócony opis i może zdecydować: "Akceptuję", "Odrzucam" lub "Dopytuję o szczegóły".
    -Dashboard Aktywnych Spraw: Prosty widok w stylu Kanban (Do zrobienia | W toku | Zakończone).
    -Moduł Komunikacji: Wewnętrzny czat (zamiast maili), który automatycznie archiwizuje ustalenia z klientem.
    -Kalendarz Terminów: Powiadomienia o zbliżających się rozprawach lub terminach zawitych dla przyjętych spraw.

2. Funkcjonalności MVP (Na start)
Aby projekt ruszył i był użyteczny, nie potrzebujesz od razu wszystkiego. Skup się na:
  1.Systemie weryfikacji prawników: Użytkownik musi mieć pewność, że adwokat to nie oszust. Integracja z listami samorządowymi (np. wyszukiwarka NRA/KIRP).
  2.Szyfrowanym "Sejfie Dokumentów": To "być albo nie być" aplikacji. Dokumenty muszą być szyfrowane (AES-256), a dostęp do nich musi być logowany.
  3.Generatorze Umów o Zastępstwo: Automatyczne generowanie prostego pełnomocnictwa lub umowy o świadczenie usług prawnych po zaakceptowaniu zlecenia wewnątrz aplikacji.
  4.Systemie Płatności (Escrow): Klient wpłaca środki na konto techniczne, a system uwalnia je dla prawnika po zakończeniu etapu (np. po wysłaniu gotowego pozwu). To buduje ogromne zaufanie.

4. Scenariusz użycia (User Flow)
  -Jan Kowalski dostaje nakaz zapłaty z sądu. Wchodzi na LexConnect.
  -Wypełnia formularz, wrzuca zdjęcie nakazu telefonem. Wybiera opcję "Szukam radcy prawnego z Warszawy do 500 zł".
  -Mecenas Nowak dostaje powiadomienie push. Przegląda dokumenty w panelu, widzi, że sprawa jest prosta.
  -Mecenas klika "Podejmij sprawę". System wysyła Janowi wiadomość: "Mecenas Nowak przyjął Twoje zlecenie. Opłać usługę, aby zacząć".
  -Jan płaci przez aplikację. Pieniądze są "zamrożone".
  -Mecenas przesyła gotowy sprzeciw od nakazu zapłaty przez panel.
  -Jan klika "Odebrano". Pieniądze trafiają na konto Mecenasa.</p>
<h1>Plan Działania</h1>
<ol>
  <li>Nastawienie mnetalne <- tu jesteśmy</li>
  <li>Zebranie informacji</li>
  <li>Odpoczynek po zbieraniu informacji</li>
  <li>ustalenia wizualne</li>
  <li>ustalenia wizualne</li>
  <li>Odpoczynek</li>
  <li>Szkielet strony</li>
  <li>Odpoczynek</li>
  <li>Prace Wykończeniowe</li>
  <li>Odpoczynek</li>
  <li>Wakacje</li>
</ol>



  






