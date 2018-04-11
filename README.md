# AgroXchange API

### Admin routes

|**URI**|**VERB**|**ACTION**|
|-------------|-----------|-----------|
| /users      | GET       | all users |


### Public routes

|**URI**|**VERB**|**ACTION**|
|-------------|-----------|-----------|
| /users      | POST      | create    |
| /logins     | POST      | login     |

### User routes

|**URI**|**VERB**|**ACTION**|
|-------------|-----------|-----------|
| /users/:id  | GET       | 1 user *  |

_* If the logged in user is the same as the user you're getting it also gets the orders for that user_