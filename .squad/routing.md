# Routing Table

> Determines which agent handles which types of work.

## Routes

| Pattern                                                                 | Agent        | Rationale                                                  |
| ----------------------------------------------------------------------- | ------------ | ---------------------------------------------------------- |
| TypeScript implementation, OSC protocol code, actions/feedbacks/presets | **Trinity**  | Backend dev owns all src/ implementation                   |
| PDF spec analysis, OSC command comparison, gap analysis, documentation  | **Tank**     | Analyst owns spec-to-code comparison and command inventory |
| Test files, test writing, edge case validation, OSC message testing     | **Neo**      | Tester owns all test creation and validation               |
| Build issues, lint errors, package commands, pre-commit hooks           | **Switch**   | DevOps owns build pipeline and tooling                     |
| Architecture review, code review, PR approval, design decisions         | **Morpheus** | Lead reviews all significant changes and architecture      |
| Final approvals, scope decisions, priority calls                        | **Owner**    | Human authority for all major decisions                    |
| Session logs, decision recording, .squad/ state commits                 | **Scribe**   | Logger maintains team memory                               |
| _Fallback / unclear_                                                    | **Morpheus** | Lead triages and routes ambiguous requests                 |

## Special Rules

- **Code changes require review**: Trinity (or Neo for tests) implements → Morpheus reviews → Owner approves if major
- **Spec analysis first**: Tank should analyze OSC spec before Trinity implements new commands
- **Tests before merge**: Neo validates before Morpheus approves
- **Build must pass**: Switch validates before any commit
- **Owner has final say**: On scope, priorities, and architecture direction
