-   Mock data factory method for DTOs, ViewModels

-   DTOs dont need to construct all properties.

-   Use Exception type to define status code, message is title, innerexception message is detail

-   Reponse: {title, status: Success||Failed, detail}
-   Handle apiError: connection error, serializeError, Defined error, undefined error. Catch, customize Exception and throw to ControllerHandler/globalexceptionhanler
-
