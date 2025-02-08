PUNKTY WYMIENIONE NIE W KOLEJNOSCI

endpoint do edycji danych konta - firstname, lastname, username, password
posprzątać frontend - spójny casing, powydzielać komponenty, poprawić globalne style, które czasami się nie aplikują (np. do przycisków formkit)
ewentualna dalsza walidacja requestow na backendzie
indexowanie postów
szyfrowanie bazy
paginacja explore, my-feed, own postów przez kursor
tls websocket
tls serwera
tls bazy
rootless containers (dockerfile z ustawionym userem + podman/docker daemon bez roota)
refresh tokeny
csp, csrf tokeny
transakcje na bazie
testy jednostkowe, integracyjne, end-to-end
load-balancing (przez nginx albo docker swarm/k3s/k8s)
email zamiast username do logowania
flaga secure na ciasteczkach jeżeli aplikacja uruchomiona w trybie produkcyjnym
zmienić wszędzie na szukanie po username a nie userId jeżeli nie trzeba szukać po userId
autoryzacja modyfikowania, usuwania postów, komentarzy
przenieść docker compose w root projektu
! walidacja mute, block, follow -> nie można siebie samego
! websockety
! naprawić .env.local i .env.prod na backendzie
