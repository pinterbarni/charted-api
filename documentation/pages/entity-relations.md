# Entity Relation Diagram

View entity relations in Mermaid Live editor [in browser](https://mermaid.live/edit#pako:eNqlVcFuozAQ_RXL57RKQpImXHdve9nzKhKawIS4MTayh7TZNP--NoYWKOm2qoSQ_eaNZ-bNYC481RnymKP5KSA3UGwVY5VFY9nFL92mEhlzz-9fYW_JCJWzTNhSwjlRUGDPsBO6t4cTEJikMjLAe6mBGGkCmbhDCFSKSRFsJAp0SFGy1CAQZgnQ0FKVWcdy3ao24yRE6ideGzrZEz4T24HF1eJTB5MBIW9q0Q3RK5oEyb4sGdrUiJKEVgEXitiw_jdtA1wpQV3VXg3aiFwokJ2jKgP-8MS-YSjxFMAchGqD7LSWCIoJm9gDGGwyf7Ra7Xy96TEptXO3XdwhdiiYe5vxHu2FEvYwavpiY2v9EymO-IUm1EjwbKFbCTRh3Cgr5UCjK8JvtTvI9QTn9xqeQB5ASkgM2lIri_8T-Ita7bWU-unj7ANnqFVAXSWf1WsndXr8OFJNGQYKYPbZMAZLbejjOIHTCYSqKpgbzRwpoXOJ3ZkI6KB7LrJtv8r20soK98H0-_Sty8myl5e7O31pL5SYbbnBVJvMbvk4qZl6z6xXI7zB2Hqqh8ao7XB4TrMeYTV99aSwHOG0TfEkW-0KQe9ZL_0b2VMP0NAaBW6U6kRBcQrVbhWf8NyIjMdkKpzwAk0BfsvridhyOqD7_XDvmIE5eqer8ylB_dG6aN2cPPmBx3uQ1u1Cj5rf3SsFVYbmh64U8Xi5eqjP4PGFP_P4br6M7qN1NJ3NHjbL6Wa-XE342eHr6H4erRy-XkTRcrO-TvjfOuzsPppN54vpOorWm9VisYmu_wAR9Ydn).

```mermaid
erDiagram
  users {
    uuid id PK
    string username
    string display_name
    string bio
    string avatar_url
    float total_distance_m
    timestamp created_at
    timestamp updated_at
  }

  user_avatars {
    uuid user_id PK
    text base64
    timestamp updated_at
  }

  trails {
    uuid id PK
    uuid user_id
    string title
    string description
    int distance_m
    string distance_unit
    float distance_original
    int duration_s
    int elevation_gain_m
    boolean is_shared
    jsonb track_points
    jsonb pois
    timestamp started_at
    timestamp finished_at
    timestamp created_at
    timestamp updated_at
  }

  trail_likes {
    uuid id PK
    uuid user_id
    uuid trail_id
    timestamp created_at
  }

  planned_routes {
    uuid id PK
    uuid user_id
    string title
    jsonb waypoints
    jsonb valhalla_response
    jsonb pois
    timestamp created_at
    timestamp updated_at
  }

  follows {
    uuid id PK
    uuid follower_id
    uuid following_id
    timestamp created_at
  }

  blocks {
    uuid id PK
    uuid blocker_id
    uuid blocked_id
    timestamp created_at
  }

  reports {
    uuid id PK
    uuid reporter_id
    enum target_type
    uuid target_id
    string reason
    string admin_response
    timestamp created_at
    timestamp updated_at
  }

  users ||--o{ trails : "records"
  users ||--o{ trail_likes : "likes"
  users ||--o{ planned_routes : "plans"
  users ||--o{ follows : "follows"
  users ||--o{ blocks : "blocks"
  users ||--o{ reports : "submits"
  users ||--o| user_avatars : "has"
  trails ||--o{ trail_likes : "receives"
```
