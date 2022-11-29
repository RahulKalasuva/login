const passportConfig = {
    credentials: {
        tenantID: "e7f89a1d-fe56-40d4-b537-7214a027bf18",
        clientID: "1af1b3bb-8ea9-44dd-a5a5-27bdbc7d9880"
    },
    metadata: {
        authority: "login.microsoftonline.com",
        discovery: ".well-known/openid-configuration",
        version: "v2.0"
    },
    settings: {
        validateIssuer: true,
        passReqToCallback: true,
        loggingLevel: "info",
        loggingNoPII: true,
    },
    protectedRoutes: {
        todolist: {
            endpoint: "/api/todolist",
            delegatedPermissions: {
                read: ["Todolist.Read", "Todolist.ReadWrite"],
                write: ["Todolist.ReadWrite"]
            },
            applicationPermissions: {
                read: ["Todolist.Read.All", "Todolist.ReadWrite.All"],
                write: ["Todolist.ReadWrite.All"]
            }
        }
    }
}

module.exports = passportConfig;
