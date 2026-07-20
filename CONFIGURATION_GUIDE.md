# Konfiguration: ENV oder Dashboard?

Für Photogallery ist ein **hybrides Modell** am sinnvollsten.

Die Regel lautet:

> Geheimnisse und technische Fähigkeiten gehören in die Umgebung. Änderbare Produktregeln gehören in die Datenbank und ins Admin-Dashboard.

## Warum nicht alles in `.env`?

Eine `.env` ist gut für Deployment-Konfiguration, aber schlecht für tägliche Produktverwaltung:

- Jede Änderung benötigt meist Neustart oder Redeploy.
- Änderungen sind nicht komfortabel über das Dashboard möglich.
- Es gibt kein Audit-Log.
- Unterschiedliche Installationen benötigen manuelle Dateibearbeitung.
- Ein Admin kann den Registrierungsmodus nicht spontan ändern.

Darum sollte der Registrierungsmodus **nicht dauerhaft nur in der `.env` liegen**.

## Warum nicht alles im Dashboard?

Einige Werte können nicht sicher oder technisch sinnvoll in der Datenbank verwaltet werden:

- Die Datenbank-URL wird benötigt, bevor die Datenbank gelesen werden kann.
- Das Better-Auth-Secret muss geheim bleiben.
- S3-, SMTP-, Stripe- oder Domain-Provider-Schlüssel dürfen nicht an Client Components gelangen.
- Bei einer kompromittierten Datenbank sollten nicht automatisch alle Infrastruktur-Credentials offengelegt werden.
- Ein falscher Dashboard-Schalter darf keine Funktion aktivieren, deren Provider gar nicht konfiguriert ist.

## In `.env` speichern

### Pflicht-Secrets

```env
DATABASE_URL=""
BETTER_AUTH_SECRET=""
```

### Deployment und Provider

```env
BETTER_AUTH_URL=""
STORAGE_DRIVER="local"
LOCAL_STORAGE_DIR="./storage"

S3_ENDPOINT=""
S3_REGION=""
S3_BUCKET=""
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""

EMAIL_PROVIDER=""
EMAIL_API_KEY=""

BILLING_PROVIDER=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

DOMAIN_PROVIDER=""
DOMAIN_PROVIDER_TOKEN=""
```

### Harte technische Grenzen

Beispiel:

```env
MAX_UPLOAD_MB_HARD="50"
```

Dieser Wert verhindert, dass ein Dashboard-Admin versehentlich eine Uploadgröße erlaubt, die Reverse Proxy, Hosting oder Arbeitsspeicher überfordert.

## In `PlatformSettings` speichern

Empfohlenes Prisma-Modell:

```prisma
enum RegistrationMode {
  OPEN
  INVITE_ONLY
  DISABLED
}

model PlatformSettings {
  id                 String           @id @default("default")
  registrationMode   RegistrationMode @default(DISABLED)
  defaultPlan        SubscriptionPlan @default(FREE)
  maintenanceMode    Boolean          @default(false)

  billingEnabled     Boolean          @default(false)
  customDomainsEnabled Boolean        @default(false)

  maxUploadMb        Int              @default(15)
  maxGalleriesFree   Int              @default(3)

  createdAt          DateTime         @default(now())
  updatedAt          DateTime         @updatedAt
}
```

Die genaue Liste kann kleiner starten. Für den ersten Schritt reichen:

```prisma
registrationMode
maintenanceMode
billingEnabled
customDomainsEnabled
maxUploadMb
```

## Capability und Enabled unterscheiden

Beispiel Billing:

```text
Capability:
Stripe-Provider und Secrets sind in ENV konfiguriert.

Enabled:
Der Admin hat billingEnabled im Dashboard aktiviert.
```

Eine Funktion ist nur aktiv, wenn beides wahr ist:

```js
const billingAvailable =
  process.env.BILLING_PROVIDER === "stripe" &&
  Boolean(process.env.STRIPE_SECRET_KEY);

const billingActive = billingAvailable && platformSettings.billingEnabled;
```

Dasselbe Muster gilt für:

- E-Mail-Versand
- S3
- Custom Domains
- Captcha
- Fehlerüberwachung

## Registrierung im Dashboard

Deine Idee ist richtig: Der Admin sollte auswählen können:

- `OPEN`: Jeder kann sich registrieren, E-Mail-Verifikation erforderlich.
- `INVITE_ONLY`: Registrierung nur mit gültigem Code.
- `DISABLED`: Keine neue Registrierung.

Wichtig: Nicht nur die Seite ausblenden. Der serverseitige Sign-up-Endpunkt muss denselben Datenbankwert prüfen.

## Erster Admin

Ein Problem bleibt: Wie entsteht der erste Admin, wenn Registrierung standardmäßig deaktiviert ist?

Empfehlung für Self-hosting:

```bash
pnpm admin:create --email admin@example.com
```

Alternativ kann ein einmaliger Setup-Assistent verwendet werden. Nach der Erstellung des ersten Admins muss dieser Bootstrap dauerhaft geschlossen werden.

Vermeide die Regel „der erste registrierte User wird automatisch Admin“, wenn öffentliche Registrierung gleichzeitig möglich sein kann.

## Rollen für dein vereinfachtes Projekt

Global brauchst du nur:

```text
user
admin
```

### `user`

- besitzt eigene Galerien über `Gallery.ownerId`
- kann eigene Galerien, Bilder, Sets und Auswahlen verwalten
- kann keine anderen Benutzer oder Systemeinstellungen verwalten

### `admin`

- ist zusätzlich Plattform-/Installationsadministrator
- kann Benutzer, Registrierung, Storage-Status und Systemeinstellungen verwalten

Nicht nötig:

- `OWNER`: Eigentum ist bereits über `Gallery.ownerId` abgebildet.
- `PHOTOGRAPHER`: beschreibt einen Beruf, keine globale Berechtigungsstufe.
- `VIEWER`: Kunden sind öffentliche Gäste ohne Dashboardrolle.

Falls später echte Teamkonten entstehen, kommen Rollen wie owner/editor/viewer in ein separates Membership-Modell. Sie ersetzen dann nicht die globale `user/admin`-Rolle.

## Empfehlung für die Umsetzung

1. Zuerst globale Rollen auf `user/admin` vereinfachen.
2. Better Auth Admin integrieren.
3. `PlatformSettings` mit `registrationMode` anlegen.
4. Serverseitigen Settings-Service erstellen.
5. Admin-Seite für Registrierung bauen.
6. Danach Einladungscodes ergänzen.
7. Provider-Capabilities ergänzen, wenn Billing oder Custom Domains tatsächlich gebaut werden.
