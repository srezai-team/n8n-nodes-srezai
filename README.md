# n8n-nodes-srezai

Community-нода n8n для [srezai.ru](https://srezai.ru) — доступ к вебу для AI-агентов.

srezai даёт агентам веб: поиск, чтение страниц, извлечение структурированных
данных, скриншоты, проверку фактов и глубокое исследование. Ноду можно
использовать и как инструмент AI-агента, и в Chain.

[n8n](https://n8n.io) — платформа автоматизации с [fair-code лицензией](https://docs.n8n.io/reference/license/).

## Установка

В n8n: **Settings → Community Nodes → Install**, затем введите `n8n-nodes-srezai`.
Подробнее — в [гайде по установке](https://docs.n8n.io/integrations/community-nodes/installation/).

## Операции

- **Поиск в интернете** — поиск страниц по текстовому запросу (1 кредит)
- **Поиск картинок** — поиск изображений по текстовому запросу (1 кредит)
- **Прочитать страницу** — открыть одну страницу и вернуть чистый markdown (1 кредит)
- **Извлечь данные** — вернуть JSON строго по вашей схеме (4 кредита)
- **Скриншот страницы** — отрисовать страницу и вернуть скриншот + markdown (3 кредита)
- **Глубокое исследование** — свести множество источников в готовый ответ (20+ кредитов)

Нода помечена `usableAsTool`, поэтому доступна как инструмент AI-агента и в Chain.

> Примечание: `verify_claim` и `get_usage` доступны только через MCP-сервер
> srezai, а не через REST API, поэтому в ноде их нет. Остаток квоты возвращается
> в заголовках ответа `X-RateLimit-*`.

## Учётные данные

Нужен ключ API srezai.ru. Создайте его в личном кабинете, затем добавьте в n8n
учётные данные **srezai API** и вставьте ключ. Ключ передаётся как `Bearer`-токен.

## Использование

Добавьте ноду **srezai**, выберите операцию и учётные данные, заполните запрос
или URL. Для **Извлечь данные** укажите JSON-схему с полями, которые хотите
получить.

## Ресурсы

- [Документация по community-нодам n8n](https://docs.n8n.io/integrations/community-nodes/)
- [srezai.ru](https://srezai.ru)

---

## English

This is an n8n community node for [srezai.ru](https://srezai.ru) — web access
for AI agents: search, page reading, structured extraction, screenshots, claim
verification and deep research. The node is usable as an AI Agent tool and in
Chains (`usableAsTool`).

**Install:** in n8n, go to **Settings → Community Nodes → Install** and enter
`n8n-nodes-srezai`.

**Operations:** Web Search (1 credit), Image Search (1 credit), Read URL
(1 credit), Extract structured data (4 credits), Fetch Page / Screenshot
(3 credits), Deep Research (20+ credits).

**Credentials:** create a srezai.ru API key in your dashboard, add **srezai API**
credentials in n8n and paste the key. It is sent as a `Bearer` token.

> `verify_claim` and `get_usage` are available only via the srezai MCP server,
> not the REST API, so they are not exposed here. Remaining quota is returned in
> `X-RateLimit-*` response headers.

## License

[MIT](LICENSE)
