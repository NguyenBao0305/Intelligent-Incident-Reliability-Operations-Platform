# Intelligent-Incident-Reliability-Operations-Platform
---

# 1. Product vision

## Tên đề tài

**NexusOps — Intelligent Incident & Reliability Operations Platform**

Định vị:

> A centralized platform for detecting operational events, reducing alert noise, routing incidents to the right responders, coordinating incident response, automating remediation, and using AI to accelerate investigation and post-incident learning.

Nó sẽ là sự kết hợp concept của:

**PagerDuty Core + AIOps + Runbook Automation + AI Agents**

nhưng ở scope đồ án thì **tập trung vào Incident Operations**.

---

# 2. Những gì hệ thống phải giải quyết

Một công ty có:

```text
AWS
Kubernetes
Database
Backend APIs
Frontend
Redis
Kafka
Payment Service
Authentication Service
...
```

Các hệ thống monitoring gửi hàng nghìn event:

```text
CPU 95%
CPU 97%
CPU 98%
API latency high
500 errors increased
Database connection failed
Payment service unavailable
```

Nếu xử lý thủ công:

```text
Monitoring
   ↓
Developer thấy alert
   ↓
Tự tìm người phụ trách
   ↓
Nhắn Slack
   ↓
Không ai trả lời
   ↓
Gọi người khác
   ↓
Tìm logs
   ↓
Tìm deployment gần nhất
   ↓
Tìm incident cũ
   ↓
Fix
   ↓
Viết postmortem
```

NexusOps biến thành:

```text
Event
  ↓
Event Processing
  ↓
Dedup / Suppression / Grouping
  ↓
Routing
  ↓
Alert
  ↓
Incident
  ↓
Escalation Policy
  ↓
On-call Responder
  ↓
AI Triage
  ↓
AI Investigation
  ↓
Human / Automation
  ↓
Resolution
  ↓
Post-Incident Review
  ↓
Knowledge / Analytics
```

Đây là lifecycle rất gần với cách PagerDuty tổ chức incident response. Một event hợp lệ có thể tạo alert, nhiều alert có thể gom thành một incident; incident sau đó được assignment qua escalation policy tới responder đang on-call. ([PagerDuty][2])

---

# 3. Scope tổng thể

Mình chia hệ thống thành **15 bounded modules**:

| #  | Module                            | Priority            |
| -- | --------------------------------- | ------------------- |
| 1  | Identity & Access Management      | Must                |
| 2  | Organization & Teams              | Must                |
| 3  | Service Directory                 | Must                |
| 4  | Integration & Event Ingestion     | Must                |
| 5  | Alert Management                  | Must                |
| 6  | Event Orchestration               | Must                |
| 7  | Incident Management               | Must                |
| 8  | On-Call Scheduling                | Must                |
| 9  | Escalation Management             | Must                |
| 10 | Notification                      | Must                |
| 11 | Incident Response & Collaboration | Should              |
| 12 | Automation / Runbooks             | Should              |
| 13 | Knowledge & Post-Incident Review  | Should              |
| 14 | AI Agent Platform                 | Core differentiator |
| 15 | Analytics & Reliability           | Should              |

---

# 4. Module 1 — Identity & Access Management

## User

Mỗi user:

```text
User
- id
- email
- username
- passwordHash
- displayName
- timezone
- avatar
- status
- createdAt
- lastLoginAt
```

## Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /users/me
```

JWT:

```text
Access Token
Refresh Token
```

Spring Security.

---

# 5. RBAC

Không chỉ có:

```text
ADMIN
USER
```

Mà:

```text
ACCOUNT_ADMIN
TEAM_MANAGER
TEAM_MEMBER
RESPONDER
STAKEHOLDER
VIEWER
```

Có thể thiết kế:

```text
User
 ↓
Organization
 ↓
Team
 ↓
Role
 ↓
Permission
```

Ví dụ:

```text
INCIDENT_VIEW
INCIDENT_CREATE
INCIDENT_ACK
INCIDENT_RESOLVE
INCIDENT_REASSIGN
SERVICE_MANAGE
SCHEDULE_MANAGE
ESCALATION_MANAGE
WORKFLOW_MANAGE
AI_RUN
AUTOMATION_EXECUTE
AUDIT_VIEW
```

PagerDuty cũng phân quyền khá sâu theo account/team/object thay vì chỉ authentication đơn giản. ([PagerDuty][3])

---

# 6. Module 2 — Organization & Team

Một organization có nhiều team:

```text
Organization
 ├── Backend Team
 ├── Frontend Team
 ├── DevOps Team
 ├── Security Team
 └── Data Team
```

Entity:

```text
Organization
Team
TeamMember
Role
Invitation
```

API:

```text
POST   /organizations
GET    /organizations/{id}

POST   /teams
GET    /teams
POST   /teams/{id}/members
DELETE /teams/{id}/members/{userId}
```

---

# 7. Module 3 — Service Directory

Đây là một trong những module **quan trọng nhất**.

PagerDuty xem technical service là một thành phần chức năng được một team sở hữu, có owner, integration, incident state và on-call context. ([PagerDuty][4])

Ví dụ:

```text
Payment Service
 ├── Owner: Payment Team
 ├── Tier: Critical
 ├── Environment: Production
 ├── Repository: github.com/company/payment
 ├── Runbook URL
 ├── Escalation Policy
 ├── Integrations
 └── Dependencies
```

## Service fields

```text
id
name
description
teamId
criticality
environment
status
repositoryUrl
runbookUrl
escalationPolicyId
```

Status:

```text
OPERATIONAL
DEGRADED
MAJOR_INCIDENT
MAINTENANCE
DISABLED
```

---

# 8. Service Dependency Graph

Đây là feature rất đáng làm.

Ví dụ:

```text
Payment API
     ↓
Payment Service
     ↓
PostgreSQL
     ↓
AWS RDS
```

Hoặc:

```text
Checkout
 ├── Payment
 ├── Inventory
 ├── User
 └── Redis
```

Nếu:

```text
PostgreSQL DOWN
```

AI có thể suy luận:

```text
PostgreSQL
   ↓
Payment
   ↓
Checkout
   ↓
Order
```

PagerDuty cũng sử dụng service dependency data để cung cấp context xung quanh incident và hỗ trợ tìm probable origin/root cause. ([PagerDuty][5])

---

# 9. Module 4 — Integration & Event Ingestion

Đây mới là phần khiến hệ thống giống PagerDuty.

Cho phép hệ thống bên ngoài gửi event:

```http
POST /api/v1/events
```

Ví dụ:

```json
{
  "source": "prometheus",
  "service": "payment-service",
  "eventType": "CPU_HIGH",
  "severity": "critical",
  "summary": "CPU > 95%",
  "timestamp": "...",
  "dedupKey": "payment-cpu-high"
}
```

Nguồn event:

```text
Prometheus
Grafana
AWS CloudWatch
GitHub Actions
Kubernetes
Custom Application
CI/CD
```

PagerDuty cũng tách Events API khỏi REST API: Events API dùng cho machine-generated event data, còn REST API phục vụ configuration/resource interaction. ([PagerDuty][4])

---

# 10. Integration Key

Mỗi integration có:

```text
integrationId
serviceId
name
provider
apiKey
status
createdAt
```

Ví dụ:

```text
payment-service
    │
    └── Prometheus Integration
          ↓
      API Key
```

Monitoring chỉ cần:

```http
POST /events
Authorization: integration-key
```

Đây là concept rất sát PagerDuty. ([PagerDuty][4])

---

# 11. Module 5 — Alert Management

Đây là nơi phải phân biệt:

```text
EVENT ≠ ALERT ≠ INCIDENT
```

## Event

Raw signal.

```text
CPU = 99%
```

## Alert

Event đã được platform xử lý.

```text
CPU High on payment-service
```

## Incident

Issue thực sự cần responder xử lý.

```text
Payment Service Production Outage
```

PagerDuty chính thức sử dụng chain event → alert → incident, và nhiều alerts có thể được aggregate vào một incident. ([PagerDuty][2])

---

# 12. Alert Deduplication

Ví dụ:

```text
10:00 CPU 95%
10:01 CPU 96%
10:02 CPU 97%
10:03 CPU 98%
```

Không tạo 4 incident.

Dùng:

```text
dedupKey
```

Kết quả:

```text
1 Incident
 ├── Alert 1
 ├── Alert 2
 ├── Alert 3
 └── Alert 4
```

---

# 13. Alert Grouping

Ví dụ:

```text
Database connection failure
API latency high
Payment timeout
Checkout timeout
```

AI/rule engine xác định:

```text
Potentially related
```

→ group vào cùng incident.

PagerDuty hiện hỗ trợ intelligent, content-based và time-based alert grouping. ([PagerDuty][6])

---

# 14. Alert Suppression

Ví dụ:

```text
Deployment đang diễn ra
```

Trong 15 phút:

```text
Suppress alerts
```

Alert vẫn được lưu để forensic/context nhưng không tạo incident/notification. Đây cũng là behavior của PagerDuty maintenance/suppression model. ([PagerDuty][7])

---

# 15. Module 6 — Event Orchestration / Rule Engine

Đây là module **rất đáng giá cho CV**.

Người quản trị có thể tạo:

```text
IF condition
THEN action
```

Ví dụ:

```text
IF
service = payment
AND severity = critical

THEN
priority = P1
route = Payment Team
```

Hoặc:

```text
IF
environment = staging

THEN
suppress alert
```

Hoặc:

```text
IF
event.count >= 5 within 5 minutes

THEN
create incident
```

PagerDuty hiện có Global Orchestration và Service Orchestration, với routing, suppression, enrichment, incident actions và automation actions. ([PagerDuty][8])

---

# 16. Rule Engine model

```text
Rule
├── priority
├── conditions[]
└── actions[]
```

Condition:

```text
field
operator
value
```

Operators:

```text
EQUALS
NOT_EQUALS
CONTAINS
STARTS_WITH
GREATER_THAN
LESS_THAN
IN
```

Actions:

```text
ROUTE
SUPPRESS
DEDUP
SET_PRIORITY
SET_SEVERITY
ADD_TAG
CREATE_INCIDENT
TRIGGER_WORKFLOW
```

---

# 17. Module 7 — Incident Management

Đây là core.

## Incident

```text
id
incidentNumber
title
description
status
priority
severity
serviceId
assignee
escalationPolicy
createdAt
acknowledgedAt
resolvedAt
```

Status:

```text
TRIGGERED
ACKNOWLEDGED
RESOLVED
```

PagerDuty sử dụng lifecycle Triggered → Acknowledged → Resolved, trong đó acknowledge dừng escalation nhưng chưa đóng incident. ([PagerDuty][9])

---

# 18. Incident actions

```text
Trigger
Acknowledge
Resolve
Reassign
Escalate
Add Responder
Add Note
Change Priority
Add Status Update
Subscribe
Run Workflow
Run Automation
```

---

# 19. Incident Timeline

Đây là feature rất nên có.

Ví dụ:

```text
10:00 Incident created
10:00 Alert received
10:00 Assigned to John
10:05 Notification sent
10:07 John acknowledged
10:09 Alice added as responder
10:11 AI investigation started
10:14 Database identified as probable cause
10:20 Rollback executed
10:22 Service recovered
10:25 Incident resolved
```

Mỗi action tạo:

```text
IncidentEvent
```

```text
type
actor
timestamp
metadata
```

---

# 20. Incident Notes

Responders có thể ghi:

```text
"Database connections exhausted."
"Rollback started."
"Waiting for DBA."
```

AI có thể dùng notes này như context.

---

# 21. Module 8 — On-Call Scheduling

Đây là **một trong những feature signature của PagerDuty**.

Ví dụ:

```text
Backend On-call

Monday → Alex
Tuesday → John
Wednesday → Minh
Thursday → Lan
Friday → Alex
```

PagerDuty cho phép schedule rotation, multiple layers và overrides. ([PagerDuty][10])

---

# 22. Schedule

```text
Schedule
├── name
├── timezone
├── rotation_type
├── start_date
├── end_date
└── layers[]
```

Rotation:

```text
DAILY
WEEKLY
CUSTOM
```

---

# 23. Schedule Layer

Ví dụ:

```text
Primary
 ├── Alex
 ├── John
 └── Minh

Secondary
 ├── Lan
 └── David
```

---

# 24. Schedule Override

Ví dụ:

```text
John nghỉ phép 10/10 → 15/10
```

Admin:

```text
Override John
     ↓
Lan
```

PagerDuty cũng dùng override layer để xử lý vacation, sickness hoặc shift swap. ([PagerDuty][11])

---

# 25. Who Is On Call?

API:

```http
GET /schedules/{id}/on-call
```

Response:

```json
{
  "schedule": "Backend Primary",
  "currentResponder": "Alex"
}
```

---

# 26. Module 9 — Escalation Policy

Đây là heart của PagerDuty.

Ví dụ:

```text
Incident
   ↓
Level 1
Backend Primary
   ↓
wait 10 min
   ↓
Level 2
Backend Secondary
   ↓
wait 15 min
   ↓
Level 3
Engineering Manager
```

PagerDuty escalation policy là ordered rules/levels, và nếu responder không acknowledge trong timeout thì incident đi sang level tiếp theo. ([PagerDuty][3])

---

# 27. Escalation Rule

```text
EscalationPolicy
 ├── Level 1
 │     └── Backend Primary
 │
 ├── Level 2
 │     └── Backend Secondary
 │
 └── Level 3
       └── Manager
```

Mỗi level:

```text
targets[]
timeoutMinutes
```

Target:

```text
USER
SCHEDULE
TEAM
```

---

# 28. Escalation Engine

Đây là nơi có thể show **concurrent/asynchronous processing**.

Pseudo:

```text
incident triggered
      ↓
find current level
      ↓
notify responder
      ↓
wait timeout
      ↓
if acknowledged
    stop
else
    next level
```

Nhưng thực tế không nên giữ HTTP request chờ 10 phút.

Dùng:

```text
Kafka
+
scheduled jobs
+
Redis
```

Ví dụ:

```text
IncidentCreated
      ↓
Kafka
      ↓
Escalation Worker
      ↓
Notification
      ↓
Redis / Scheduler
      ↓
EscalationTimeout
```

Đây là chỗ rất tốt để chứng minh kiến thức distributed system.

---

# 29. Module 10 — Notification

PagerDuty hỗ trợ nhiều notification channels như push, phone, SMS, email và Slack, đồng thời cho phép cấu hình thứ tự/thời gian của notification rules. ([PagerDuty][12])

Đối với đồ án:

### MVP

```text
Email
In-App
WebSocket
```

### Advanced

```text
Telegram
Slack
Discord
SMS
```

---

# 30. Notification Rules

User có thể cấu hình:

```text
P1 → immediately Email
P1 → +1min Telegram
P1 → +3min Phone/SMS
```

Hoặc:

```text
P3 → Email only
```

Data model:

```text
NotificationRule
├── userId
├── incidentPriority
├── channel
├── delaySeconds
└── enabled
```

---

# 31. Notification Worker

Không gửi email trực tiếp từ controller.

Sai:

```text
POST /incident
   ↓
SMTP
   ↓
response
```

Nên:

```text
POST /incident
   ↓
DB
   ↓
Kafka
   ↓
Notification Consumer
   ↓
Email
```

---

# 32. Module 11 — Incident Collaboration

Một incident lớn cần nhiều người.

PagerDuty có responder requests và conference bridge để kéo thêm responders vào incident. ([PagerDuty][13])

NexusOps:

```text
Incident
 ├── Assignee
 ├── Responders
 ├── Subscribers
 └── Incident Commander
```

---

# 33. Incident Roles

Đối với major incident:

```text
Incident Commander
Technical Lead
Communications Lead
Scribe
Responder
```

Đây là điểm mình khuyên nên thêm vì hệ thống sẽ trông **enterprise hơn rất nhiều**.

---

# 34. Live Incident Room

Mỗi P1 incident có:

```text
Incident Room
```

Có:

```text
Chat
Timeline
Status
Responders
AI Agent
Alerts
Logs
Runbook
Service Graph
```

Realtime bằng:

```text
WebSocket / SSE
```

---

# 35. Incident Status Updates

Ví dụ:

```text
10:00 Investigating
10:10 Root cause suspected
10:15 Mitigation in progress
10:25 Service recovering
10:30 Resolved
```

Stakeholder có thể subscribe để nhận update.

PagerDuty có stakeholder subscriptions, status-update templates và status dashboards cho việc truyền đạt customer/business impact. ([PagerDuty][14])

---

# 36. Module 12 — Automation / Runbook

Đây là phần để tiến từ:

> "Incident management"

sang:

> "Operations automation."

Ví dụ runbook:

```text
Restart payment service
Clear Redis cache
Scale Kubernetes deployment
Rollback deployment
Check database connectivity
Get application logs
```

Một runbook:

```text
Runbook
├── name
├── description
├── command
├── service
├── riskLevel
└── requiresApproval
```

PagerDuty Automation Actions cũng hỗ trợ diagnostic/remediation actions và có thể trigger từ event orchestration. ([PagerDuty][15])

---

# 37. Human Approval

**Tuyệt đối không để AI tự chạy shell command production mà không có control.**

Ví dụ:

```text
AI:
"Rollback deployment to v1.42"

       ↓

Risk = HIGH

       ↓

Human Approval

       ↓

Approved

       ↓

Automation Worker

       ↓

Execute
```

Đây cũng phù hợp với hướng PagerDuty hiện tại: SRE Agent có thể đề xuất/perform approved remediation và được thiết kế với controls/guardrails. ([PagerDuty][1])

---

# 38. Module 13 — Knowledge Base

Lưu:

```text
Runbook
Architecture Document
Troubleshooting Guide
FAQ
Past Incident
Postmortem
```

Ví dụ:

```text
"Payment timeout troubleshooting"

1. Check DB
2. Check Redis
3. Check payment provider
4. Check deployment
5. Rollback if necessary
```

---

# 39. RAG

Documents:

```text
Knowledge
     ↓
Chunk
     ↓
Embedding
     ↓
Vector DB
     ↓
PGVector
```

AI query:

```text
Why is payment-service timing out?
```

RAG retrieves:

```text
3 relevant documents
+
5 past incidents
+
2 runbooks
```

---

# 40. Module 14 — AI Platform

Đây là phần **khác biệt lớn nhất của project**.

Không làm:

```text
ChatGPT clone
```

Mà làm:

> **AI agents with operational tools.**

PagerDuty hiện đã xây AI theo hướng specialized agents cho các giai đoạn khác nhau của incident lifecycle, gồm SRE Agent, Scribe Agent, Shift Agent và Insights Agent. ([PagerDuty][1])

---

# 41. AI Agent #1 — Alert Triage Agent

Input:

```text
Alert
```

AI:

```text
Classify severity
Check duplicates
Find related alerts
Identify affected service
Find previous incidents
```

Output:

```json
{
  "severity": "P1",
  "likelyService": "payment-service",
  "relatedIncidents": [],
  "confidence": 0.91
}
```

---

# 42. AI Agent #2 — Incident Investigation Agent

Đây nên là **AI flagship feature**.

User:

> "Investigate this incident."

Agent thực hiện:

```text
Incident
 ↓
Get alerts
 ↓
Get service
 ↓
Get dependencies
 ↓
Get recent deployments
 ↓
Get logs
 ↓
Get metrics
 ↓
Get similar incidents
 ↓
Search knowledge base
 ↓
Reason
 ↓
Produce hypotheses
```

PagerDuty mô tả SRE Agent hiện tại theo hướng gather signals từ logs, metrics, deployments, past incidents và knowledge/context trong một investigation kéo dài cho đến khi converges. ([PagerDuty][16])

---

# 43. Tool Calling

AI Agent được cấp tools:

```text
getIncident()
getAlerts()
getService()
getDependencies()
getRecentDeployments()
getLogs()
getMetrics()
searchKnowledge()
searchPastIncidents()
getOnCallResponder()
runDiagnostic()
```

LLM tự quyết định:

```text
Need database info
     ↓
getDependencies()

Need deployment data
     ↓
getRecentDeployments()
```

Đây mới thực sự là **Agent**, thay vì chỉ prompt LLM.

---

# 44. AI Investigation Output

Ví dụ:

```text
Probable Root Cause
────────────────────

Payment service database connection pool exhausted.

Evidence:
• 87% increase in DB connection failures
• Connection pool reached 100%
• Deployment v1.42 occurred 8 minutes before incident
• Similar incident INC-182 occurred 3 months ago

Confidence: 87%

Recommended Actions:
1. Rollback v1.42
2. Restart payment-service
3. Increase DB pool size

Risk:
HIGH

Requires approval: YES
```

---

# 45. AI Agent #3 — Postmortem/Scribe Agent

Sau incident:

```text
Timeline
Logs
Notes
Actions
Chat
Deployment
AI investigation
```

→ AI tạo:

```text
Incident Summary
Impact
Timeline
Root Cause
Contributing Factors
Detection
Resolution
What went well
What went wrong
Action Items
```

PagerDuty hiện đã đưa AI-generated Post-Incident Reviews vào product rollout, và Scribe Agent dùng incident meetings/channel information để hỗ trợ post-incident review. ([PagerDuty][17])

---

# 46. AI Agent #4 — Knowledge Agent

Query:

> "How do we recover Redis failure?"

Agent:

```text
RAG
 ↓
Runbook
 ↓
Past incidents
 ↓
Recommend procedure
```

Không thực thi.

---

# 47. AI Agent #5 — Remediation Agent

Advanced.

AI xác định:

```text
Recommended:
restart deployment

Risk:
LOW
```

Hoặc:

```text
rollback deployment
```

Risk:

```text
HIGH
```

→ requires human approval.

---

# 48. AI Agent #6 — On-call Assistant

Ví dụ:

> "Who should I page for payment?"

Agent:

```text
Payment Service
 ↓
Escalation Policy
 ↓
Current schedule
 ↓
Current on-call
```

Output:

```text
Current primary responder:
Nguyen Van A

Backup:
Nguyen Van B
```

---

# 49. Module 15 — Post-Incident Review

Incident resolved chưa phải kết thúc.

Tạo PIR:

```text
PostIncidentReview
├── incidentId
├── summary
├── rootCause
├── impact
├── timeline
├── actionItems
├── owner
├── dueDate
└── status
```

Stages có thể:

```text
DRAFT
IN_REVIEW
APPROVED
COMPLETED
```

PagerDuty hiện có Post-Incident Review workflow/stages. ([PagerDuty][18])

---

# 50. Action Items

Ví dụ:

```text
Increase DB connection pool
Owner: Backend Team
Due: 20/09
Status: TODO
```

Types:

```text
BUG_FIX
INFRASTRUCTURE
MONITORING
PROCESS
DOCUMENTATION
SECURITY
```

---

# 51. Module 16 — Analytics

Dashboard:

```text
Total Incidents
P1 Incidents
MTTA
MTTR
Incident Frequency
Alert Volume
Escalation Rate
Resolution Rate
```

---

# 52. Reliability Metrics

Đây là những metric nên làm:

### MTTA

Mean Time To Acknowledge

```text
acknowledgedAt - triggeredAt
```

### MTTR

Mean Time To Resolve

```text
resolvedAt - triggeredAt
```

### MTTD

Mean Time To Detect

```text
detectedAt - actualFailureAt
```

### Escalation Rate

```text
escalated incidents
--------------------
total incidents
```

---

# 53. Alert Noise Analytics

Ví dụ:

```text
Total Events
100,000

Alerts
15,000

Deduplicated
9,000

Suppressed
2,000

Incidents
800
```

Dashboard:

```text
Event
 ↓
Alert
 ↓
Incident
```

Đây rất sát tư duy Event Analytics của PagerDuty, nơi họ theo dõi event journey từ ingestion tới outcome như deduplication, suppression, routing và incident creation. ([PagerDuty][19])

---

# 54. SLA / SLO

Có thể thêm:

```text
Service
 ├── SLO: 99.9%
 ├── Error Budget
 └── Availability
```

Incident ảnh hưởng:

```text
Payment Service
SLO = 99.9%
Current = 99.72%
```

---

# 55. Status Page

Đây là **optional nhưng rất đẹp khi demo**.

Public:

```text
NexusOps Status

Payment API       Operational
Authentication    Operational
Checkout          Degraded
Database          Operational
```

Khi P1 xảy ra:

```text
Checkout
↓
Major Outage

Investigating
```

PagerDuty hiện có public/private/audience-specific status pages và hỗ trợ automated updates với human approval. ([PagerDuty][20])

---

# 56. Maintenance Window

Admin có thể:

```text
Payment Service
Maintenance:
01:00 - 02:00
```

Trong thời gian này:

```text
incoming events
      ↓
SUPPRESS
```

Không tạo incident.

PagerDuty cũng có maintenance window để tạm disable triggering cho service trong một khoảng thời gian. ([PagerDuty][21])

---

# 57. Audit Log

Mọi critical action phải log:

```text
WHO
DID WHAT
WHEN
ON WHICH OBJECT
FROM WHAT
TO WHAT
```

Ví dụ:

```text
Admin John
changed escalation timeout
10 → 15 minutes
```

Entity:

```text
AuditLog
├── actorId
├── action
├── resourceType
├── resourceId
├── oldValue
├── newValue
├── ipAddress
└── timestamp
```

Đây là feature mình khuyên **Must**, đặc biệt nếu muốn project có vẻ enterprise.

---

# 58. Event-driven architecture

Đây là kiến trúc mình đề xuất:

```text
                 ┌─────────────────┐
                 │ Monitoring Tools│
                 └────────┬────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Event Ingestion   │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Orchestration     │
                │ Rule Engine       │
                └─────────┬─────────┘
                          │
                  ┌───────┴───────┐
                  ▼               ▼
               Alert           Suppress
                  │
                  ▼
           Dedup / Grouping
                  │
                  ▼
               Incident
                  │
                  ▼
              Kafka Bus
           ┌──────┼─────────┬─────────┐
           ▼      ▼         ▼         ▼
       Notify   Escalate    AI      Audit
           │      │         │         │
           │      │         ▼         │
           │      │     Investigation │
           │      │         │         │
           └──────┴─────────┴─────────┘
                         │
                         ▼
                      Resolve
                         │
                         ▼
                       PIR
                         │
                         ▼
                    Knowledge
```

---

# 59. Kafka Events

Các event chính:

```text
EventReceived
AlertCreated
AlertDeduplicated
AlertGrouped
IncidentCreated
IncidentAcknowledged
IncidentEscalated
ResponderAdded
NotificationRequested
NotificationSent
AIInvestigationStarted
AIInvestigationCompleted
AutomationRequested
AutomationApproved
AutomationExecuted
IncidentResolved
PIRCreated
```

---

# 60. Redis

Dùng Redis cho:

```text
Rate limiting
Caching
Idempotency
Current on-call cache
Incident locks
Dedup keys
Temporary workflow state
AI session state
```

Ví dụ:

```text
dedup:payment-cpu-high
```

---

# 61. Idempotency

Đây là feature **rất đáng ghi vào CV**.

Monitoring có thể gửi:

```text
same event
same event
same event
```

Server phải đảm bảo:

```text
1 event → 1 effect
```

Ví dụ:

```text
POST /events
Idempotency-Key: abc123
```

Nếu request được gửi lại:

```text
return existing result
```

---

# 62. Distributed locking

Hai worker cùng xử lý:

```text
Incident INC-123
```

Không được:

```text
Worker A → escalate
Worker B → escalate
```

Dùng:

```text
Redis distributed lock
```

hoặc optimistic locking:

```text
version
```

---

# 63. Retry + Dead Letter Queue

Notification:

```text
Send Email
   ↓
FAILED
   ↓
Retry #1
   ↓
FAILED
   ↓
Retry #2
   ↓
FAILED
   ↓
DLQ
```

Kafka:

```text
notification.retry
notification.dlq
```

---

# 64. Rate Limiting

Ví dụ một service bị lỗi:

```text
10,000 events/sec
```

Không được để hệ thống chết theo.

Dùng:

```text
Redis Token Bucket
```

Ví dụ:

```text
100 requests/sec/service
```

---

# 65. Architecture choice

Mình **không khuyên nhóm làm 15 microservices ngay từ đầu**.

Làm:

## Phase 1

```text
Modular Monolith
Spring Boot
PostgreSQL
Redis
```

Modules:

```text
auth
organization
service
event
alert
incident
schedule
escalation
notification
```

Sau khi core chạy:

```text
Kafka
AI
Automation
```

rồi mới tách workload nếu cần.

---

# 66. Stack đề xuất

## Backend

```text
Java 21/25
Spring Boot
Spring Security
Spring Data JPA
Hibernate
Spring Validation
Spring Web
Spring WebSocket
Spring Kafka
Spring AI
```

## Database

```text
PostgreSQL
PGVector
Redis
```

## Messaging

```text
Kafka
```

## AI

```text
OpenAI / Anthropic
Spring AI
RAG
Tool Calling
Embeddings
```

## Infrastructure

```text
Docker
Docker Compose
GitHub Actions
AWS
```

## Observability

```text
Prometheus
Grafana
Loki
OpenTelemetry
```

---

# 67. Database sơ bộ

Các bảng chính:

```text
users
roles
permissions
user_roles

organizations
teams
team_members

services
service_dependencies
service_integrations
maintenance_windows

events
alerts
alert_groups

routing_rules
orchestration_rules

incidents
incident_alerts
incident_events
incident_notes
incident_responders
incident_subscribers

schedules
schedule_layers
schedule_members
schedule_overrides

escalation_policies
escalation_rules

notification_rules
notification_deliveries

workflows
workflow_steps
workflow_executions

runbooks
automation_actions
automation_executions

knowledge_documents
knowledge_chunks
embeddings

ai_agents
ai_sessions
ai_tool_calls
ai_investigations

post_incident_reviews
post_incident_actions

audit_logs

slo_configs
service_metrics
```

---

# 68. Core relationships

```text
Organization
   │
   ├── Users
   ├── Teams
   │      │
   │      └── Services
   │
   └── Escalation Policies
             │
             └── Schedules
```

Service:

```text
Service
 ├── Integration
 ├── Escalation Policy
 ├── Schedule
 ├── Dependencies
 ├── Alerts
 └── Incidents
```

Incident:

```text
Incident
 ├── Alerts
 ├── Responders
 ├── Timeline
 ├── Notes
 ├── Status Updates
 ├── AI Investigation
 ├── Automation
 └── Postmortem
```

---

# 69. Main API design

## Auth

```http
POST /api/v1/auth/login
POST /api/v1/auth/refresh
```

## Services

```http
POST   /api/v1/services
GET    /api/v1/services
GET    /api/v1/services/{id}
PATCH  /api/v1/services/{id}
DELETE /api/v1/services/{id}
```

## Events

```http
POST /api/v1/events
```

## Alerts

```http
GET    /api/v1/alerts
GET    /api/v1/alerts/{id}
POST   /api/v1/alerts/{id}/resolve
```

## Incidents

```http
POST   /api/v1/incidents
GET    /api/v1/incidents
GET    /api/v1/incidents/{id}

POST   /api/v1/incidents/{id}/acknowledge
POST   /api/v1/incidents/{id}/resolve
POST   /api/v1/incidents/{id}/escalate
POST   /api/v1/incidents/{id}/responders
POST   /api/v1/incidents/{id}/notes
POST   /api/v1/incidents/{id}/status-updates
```

## Schedules

```http
POST /api/v1/schedules
GET  /api/v1/schedules
GET  /api/v1/schedules/{id}/on-call
POST /api/v1/schedules/{id}/overrides
```

## Escalation

```http
POST /api/v1/escalation-policies
GET  /api/v1/escalation-policies
```

## AI

```http
POST /api/v1/ai/incidents/{id}/triage
POST /api/v1/ai/incidents/{id}/investigate
POST /api/v1/ai/incidents/{id}/summarize
POST /api/v1/ai/incidents/{id}/recommendations
```

## Automation

```http
GET  /api/v1/runbooks
POST /api/v1/runbooks/{id}/execute
POST /api/v1/automation/{id}/approve
```

---

# 70. Một incident P1 hoàn chỉnh sẽ chạy như thế nào?

Đây nên là **demo chính của nhóm**.

Giả sử:

```text
Payment Service Database Down
```

## Step 1

Prometheus:

```text
DB connection failures > threshold
```

gửi:

```http
POST /events
```

---

## Step 2

Event orchestration:

```text
service = payment
severity = critical
```

→ P1.

---

## Step 3

Dedup engine:

```text
dedupKey = payment-db-connection
```

Nếu chưa tồn tại:

```text
create alert
```

---

## Step 4

Incident engine:

```text
Alert
 ↓
Incident INC-1001
```

---

## Step 5

Escalation:

```text
Payment Primary
```

---

## Step 6

Notification:

```text
WebSocket
Email
Slack/Telegram
```

---

## Step 7

AI Triage:

```text
Find related alerts
Find recent deploys
Find dependencies
```

---

## Step 8

AI Investigation:

```text
Database failures increased
+
deployment 8 minutes ago
+
same pattern in INC-884
```

→ probable root cause.

---

## Step 9

AI Recommendation:

```text
Rollback payment-service v1.42
```

---

## Step 10

Human approval:

```text
Approve
```

---

## Step 11

Automation:

```text
Rollback deployment
```

---

## Step 12

Monitoring reports:

```text
DB connections recovered
```

---

## Step 13

Incident:

```text
RESOLVED
```

---

## Step 14

AI Postmortem:

```text
Impact
Timeline
Root Cause
Resolution
Action Items
```

---

# 71. Đây mới là demo "ăn điểm"

Thay vì demo:

```text
Login
Create service
Create incident
Delete incident
```

Nhóm demo:

```text
1. Monitoring sends 20 alerts
2. System deduplicates them
3. Creates one P1 incident
4. Routes to on-call
5. Escalates if nobody responds
6. AI investigates
7. AI finds recent deployment
8. AI recommends rollback
9. Human approves
10. Automation executes
11. Incident resolves
12. AI creates postmortem
13. Dashboard updates MTTR
```

Đó là một **end-to-end operational workflow**.

---

# 72. Phân chia nhóm 5 người

## Member 1 — Core Incident Backend

Phụ trách:

```text
Service
Event
Alert
Incident
Timeline
Incident API
```

Công nghệ:

```text
Spring Boot
JPA
PostgreSQL
Kafka
```

---

## Member 2 — Identity / Organization / Access

```text
Auth
JWT
RBAC
Organization
Teams
Users
Audit
```

---

## Member 3 — Reliability / Distributed System

```text
On-call
Schedules
Escalation
Notification
Redis
Kafka
Retry
DLQ
```

Đây là người làm phần system design nặng nhất.

---

## Member 4 — AI

```text
Spring AI
RAG
PGVector
Tool Calling
Incident Investigation Agent
Triage Agent
Postmortem Agent
```

---

## Member 5 — Automation / DevOps / Observability

```text
Runbook
Automation
CI/CD
Docker
AWS
Prometheus
Grafana
OpenTelemetry
Deployment integration
```

---

# 73. Frontend nên có những màn hình nào?

## Dashboard

```text
Open Incidents
P1
P2
MTTR
MTTA
Alert Noise
Services
```

## Incidents

```text
All
Triggered
Acknowledged
Resolved
P1
P2
```

## Incident Detail

Đây là màn hình quan trọng nhất:

```text
┌──────────────────────────────────────────┐
│ P1 Payment Service Outage                │
│                                          │
│ Status: ACKNOWLEDGED                     │
│ Assignee: Alex                           │
│ Service: Payment                         │
│                                          │
│ [Acknowledge] [Resolve] [Escalate]       │
│                                          │
│ AI Investigation                         │
│ ─────────────────                        │
│ Probable Cause: Database                 │
│ Confidence: 87%                          │
│                                          │
│ Recommendations                          │
│ [Rollback v1.42]                         │
│                                          │
│ Timeline                                 │
│ 10:01 Alert                              │
│ 10:02 Incident                           │
│ 10:03 Notify Alex                        │
│ ...                                      │
└──────────────────────────────────────────┘
```

---

# 74. Service Detail

```text
Payment Service

Status: Degraded

Owner:
Payment Team

On Call:
Alex

Dependencies:
 ├── PostgreSQL
 ├── Redis
 └── Payment Gateway

Open Incidents:
 2

Recent Deployments:
 v1.42
 v1.41
```

---

# 75. On-call UI

Calendar:

```text
Mon     Tue     Wed     Thu     Fri
Alex    John    Minh    Lan     Alex
```

Có:

```text
Create Schedule
Add Member
Swap Shift
Override
View Current On-call
```

---

# 76. Incident War Room

```text
┌──────────────────────────────────────────────┐
│ P1 Payment Outage                            │
├──────────────┬───────────────────────────────┤
│ Responders   │ Timeline                      │
│              │                               │
│ Alex         │ 10:01 Alert                   │
│ Minh         │ 10:02 Incident               │
│ Lan          │ 10:03 AI Started             │
│              │                               │
├──────────────┴───────────────────────────────┤
│ AI Investigation                             │
│                                               │
│ [Analyzing Logs...]                           │
│ [Checking Deployments...]                     │
│ [Checking Dependencies...]                    │
│                                               │
│ Result: DB connection exhaustion             │
└───────────────────────────────────────────────┘
```

Đây sẽ là UI demo cực kỳ mạnh.

---

# 77. Scope theo Phase

Không làm tất cả cùng lúc.

## Phase 1 — Foundation

```text
Auth
RBAC
Organization
Team
Service
Incident
Alert
```

Mục tiêu:

```text
event → alert → incident
```

---

# 78. Phase 2 — PagerDuty Core

```text
Integration
Event ingestion
Dedup
Grouping
Routing
On-call
Escalation
Notification
Timeline
```

Mục tiêu:

```text
event
 ↓
incident
 ↓
on-call
 ↓
escalation
 ↓
notification
```

---

# 79. Phase 3 — Advanced Operations

```text
Redis
Kafka
Retry
DLQ
Maintenance
Runbooks
Automation
Status updates
Incident collaboration
```

---

# 80. Phase 4 — AI

```text
RAG
Knowledge Base
Triage Agent
Investigation Agent
Postmortem Agent
Tool Calling
Human approval
```

---

# 81. Phase 5 — Production Engineering

```text
Docker
CI/CD
AWS
Prometheus
Grafana
OpenTelemetry
Load testing
Security
Rate limiting
Audit
```

---

# 82. Priority matrix

| Feature           | Priority               |
| ----------------- | ---------------------- |
| Auth/JWT          | 🔴 Must                |
| RBAC              | 🔴 Must                |
| Organization/Team | 🔴 Must                |
| Service Directory | 🔴 Must                |
| Event Ingestion   | 🔴 Must                |
| Alert             | 🔴 Must                |
| Dedup             | 🔴 Must                |
| Incident          | 🔴 Must                |
| On-call           | 🔴 Must                |
| Escalation        | 🔴 Must                |
| Notification      | 🔴 Must                |
| Kafka             | 🟠 Should              |
| Redis             | 🟠 Should              |
| Rule Engine       | 🟠 Should              |
| Runbook           | 🟠 Should              |
| RAG               | 🔴 Must for AI version |
| AI Investigation  | 🔴 Must                |
| AI Triage         | 🟠 Should              |
| AI Postmortem     | 🟠 Should              |
| Automation        | 🟠 Should              |
| Status Page       | 🟡 Nice                |
| SLO               | 🟡 Nice                |
| Mobile app        | 🟡 Nice                |
| Multi-region      | ⚪ Skip                 |

---

# 83. Những thứ KHÔNG nên làm

Để tránh scope nổ tung, mình khuyên **không** làm:

```text
❌ Full monitoring system
❌ Tự xây Prometheus
❌ Tự xây log collector như ELK
❌ Tự train ML model
❌ Full Kubernetes operator
❌ Full Terraform platform
❌ Mobile app native
❌ Multi-region HA
❌ 20 microservices ngay từ đầu
```

Thay vào đó:

```text
Prometheus
Grafana
Kubernetes
AWS
GitHub Actions
```

được xem là **external integrations**.

---

# 84. Phần nào sẽ thực sự gây ấn tượng trong CV?

Không phải:

```text
Spring Boot
PostgreSQL
JWT
Docker
```

vì quá phổ biến.

Điểm mạnh của project sẽ là:

### 1. Event-driven architecture

```text
Kafka
```

### 2. Incident orchestration

```text
Routing
Dedup
Grouping
Escalation
```

### 3. Distributed reliability

```text
Idempotency
Retry
DLQ
Distributed locking
Rate limiting
```

### 4. AI agents

```text
Tool calling
RAG
Incident investigation
Human-in-the-loop remediation
```

### 5. Production engineering

```text
Observability
CI/CD
Docker
AWS
```

---

# 85. Một dòng CV có thể ghi

Ví dụ sau khi project thực sự hoàn thành:

> **NexusOps — AI-Powered Incident & Reliability Operations Platform**
> Built an event-driven incident management platform using Java/Spring Boot, Kafka, PostgreSQL, Redis and Spring AI, implementing alert deduplication, rule-based event orchestration, on-call scheduling, escalation policies, multi-channel notifications, RAG-powered incident investigation, tool-calling AI agents and human-approved automated remediation.

Đây sẽ **mạnh hơn rất nhiều** so với kiểu:

> Built a Spring Boot CRUD application for managing incidents.

---

# 86. Mức độ hoàn chỉnh mình khuyên nhóm hướng tới

Nếu chia thành 3 mức:

### Level 1 — CRUD project

```text
Auth
Service
Incident
```

**~4/10**

### Level 2 — PagerDuty-like

```text
Event
Alert
Incident
On-call
Escalation
Notification
Kafka
Redis
```

**~8.5/10**

### Level 3 — AI Operations Platform

```text
Everything above
+
RAG
+
AI Investigation
+
Tool Calling
+
Automation
+
Human Approval
+
Observability
+
Postmortem
```

**~9.5/10**

Mình khuyên nhóm nhắm **Level 3**, nhưng triển khai tuần tự qua Level 1 → 2 → 3, thay vì cố code tất cả ngay từ đầu.

---

# 87. Kiến trúc cuối cùng

```text
                    ┌───────────────────────┐
                    │ Monitoring / CI / K8s │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Event Ingestion     │
                    │   REST / Webhook      │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │ Event Orchestration   │
                    │ Routing / Suppression │
                    │ Enrichment / Rules    │
                    └───────────┬───────────┘
                                │
                         ┌──────┴──────┐
                         ▼             ▼
                      Suppress       Alert
                                       │
                             Dedup / Grouping
                                       │
                                       ▼
                                  INCIDENT
                                       │
                     ┌─────────────────┼─────────────────┐
                     ▼                 ▼                 ▼
                 Escalation        Notification       AI Agent
                     │                 │                 │
                     ▼                 ▼                 ▼
                 On-call          Email/WebSocket     RAG/Tools
                                                         │
                                                         ▼
                                                  Investigation
                                                         │
                                              ┌──────────┴─────────┐
                                              ▼                    ▼
                                        Recommendation         Automation
                                                                   │
                                                              Human Approval
                                                                   │
                                                                   ▼
                                                                Execute
                                                                   │
                                                                   ▼
                                                               Resolve
                                                                   │
                                                                   ▼
                                                            Postmortem/PIR
                                                                   │
                                                                   ▼
                                                               Knowledge
                                                                   │
                                                                   ▼
                                                               Analytics
```

---

# 88. Kết luận

Nếu **theo hướng PagerDuty**, mình sẽ chốt product scope của nhóm như sau:

> **NexusOps là một platform quản lý incident và reliability theo event-driven architecture, nhận event từ monitoring/CI systems, xử lý alert bằng deduplication/grouping/routing, tự động xác định responder qua on-call + escalation policy, điều phối incident response, cung cấp realtime collaboration, dùng AI agents để triage/investigate/summarize incidents, và thực hiện remediation có human approval.**

Điểm quan trọng nhất là **đừng biến nó thành "Jira clone có AI"**. Core identity của sản phẩm phải là:

**Event → Alert → Incident → On-call → Escalation → Investigation → Remediation → Postmortem.**

Đó là hướng sát PagerDuty nhất, và cũng là hướng có nhiều thứ để thể hiện **Java Backend + Distributed System + AI + DevOps**.

Các capability PagerDuty mình dùng làm baseline ở trên được lấy từ tài liệu sản phẩm/support hiện hành của PagerDuty, bao gồm Incident/Alert lifecycle, Escalation/On-call, Event Orchestration, Service Directory, Automation, AI Agents, Post-Incident Review và Status Pages. ([PagerDuty][2])

[1]: https://www.pagerduty.com/platform/ai-agents/?utm_source=chatgpt.com "Enterprise AI Agents | PagerDuty"
[2]: https://support.pagerduty.com/main/docs/alerts?utm_source=chatgpt.com "Alerts"
[3]: https://support.pagerduty.com/main/docs/escalation-policies?utm_source=chatgpt.com "Escalation Policy Basics"
[4]: https://support.pagerduty.com/main/docs/services-and-integrations?utm_source=chatgpt.com "Services and Integrations"
[5]: https://support.pagerduty.com/main/docs/service-dependencies?utm_source=chatgpt.com "Service Dependencies"
[6]: https://support.pagerduty.com/main/docs/alert-grouping?utm_source=chatgpt.com "Alert Grouping"
[7]: https://support.pagerduty.com/main/docs/event-management?utm_source=chatgpt.com "Event Management"
[8]: https://support.pagerduty.com/main/docs/event-orchestration?utm_source=chatgpt.com "Event Orchestration"
[9]: https://support.pagerduty.com/main/docs/incidents?utm_source=chatgpt.com "Incidents"
[10]: https://support.pagerduty.com/main/docs/escalation-policies-and-schedules?utm_source=chatgpt.com "Escalation Policies and Schedules"
[11]: https://support.pagerduty.com/main/docs/edit-schedules?utm_source=chatgpt.com "Edit Schedules"
[12]: https://support.pagerduty.com/main/docs/notification-rules?utm_source=chatgpt.com "Notification Rules"
[13]: https://support.pagerduty.com/main/docs/conference-bridge?utm_source=chatgpt.com "Conference Bridge"
[14]: https://www.pagerduty.com/platform/incident-management/stakeholder-communication/?utm_source=chatgpt.com "Stakeholder Communication | PagerDuty"
[15]: https://support.pagerduty.com/main/docs/automation-actions?utm_source=chatgpt.com "PagerDuty Automation Actions"
[16]: https://www.pagerduty.com/eng/inside-pagerdutys-sre-agent-how-we-built-deep-incident-investigation/?utm_source=chatgpt.com "Inside PagerDuty's SRE Agent: How We Built Deep Incident Investigation | PagerDuty"
[17]: https://support.pagerduty.com/main/changelog?page=2&utm_source=chatgpt.com "Platform Release Notes"
[18]: https://support.pagerduty.com/main/docs/post-incident-review-stages?utm_source=chatgpt.com "Post-Incident Review Stages"
[19]: https://support.pagerduty.com/main/docs/event-analytics?utm_source=chatgpt.com "Event Analytics"
[20]: https://www.pagerduty.com/platform/business-ops/status-pages/?utm_source=chatgpt.com "PagerDuty Status Pages | PagerDuty"
[21]: https://support.pagerduty.com/main/docs/maintenance-windows?utm_source=chatgpt.com "Maintenance Windows"
