const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./data/db.json');
const db = lowdb(adapter);

const {
  isAppOnlyToken,
  hasRequiredDelegatedPermissions,
  hasRequiredApplicationPermissions
} = require('../auth/permissionUtils');

const authConfig = require('../authConfig');

exports.getTodo = (req, res, next) => {
    if (isAppOnlyToken(req.authInfo)) {
        if (hasRequiredApplicationPermissions(req.authInfo, authConfig.protectedRoutes.todolist.applicationPermissions.read)) {
            try {
                const id = req.params.id;
                const todo = db.get('todos')
                    .find({ id: id })
                    .value();
                res.status(200).send(todo);
            } catch (error) {
                next(error);
            }
        } else {
            next(new Error('Application does not have the required permissions'))
        }
    } else {
        if (hasRequiredDelegatedPermissions(req.authInfo, authConfig.protectedRoutes.todolist.delegatedPermissions.read)) {
            try {
                 // The 'oid' (object id) is the only claim that should be used to uniquely identify
                const owner = req.authInfo['oid'];
                const id = req.params.id;
    
                const todo = db.get('todos')
                    .filter({ owner: owner })
                    .find({ id: id })
                    .value();
    
                res.status(200).send(todo);
            } catch (error) {
                next(error);
            }
        } else {
            next(new Error('User does not have the required permissions'))
        }
    }
}

exports.getTodos = (req, res, next) => {
    // console.log(req)
    if (isAppOnlyToken(req.authInfo)) {
        if (hasRequiredApplicationPermissions(req.authInfo, authConfig.protectedRoutes.todolist.applicationPermissions.read)) {
            try {
                const todos = db.get('todos')
                    .value();
    
                res.status(200).send(todos);
            } catch (error) {
                next(error);
            }
        } else {
            next(new Error('Application does not have the required permissions'))
        }
    } else {
        if (hasRequiredDelegatedPermissions(req.authInfo, authConfig.protectedRoutes.todolist.delegatedPermissions.read)) {
            try {
                const owner = req.authInfo['oid'];
    
                const todos = db.get('todos')
                    .filter({ owner: owner })
                    .value();
    
                res.status(200).send(todos);
            } catch (error) {
                next(error);
            }
        } else {
            next(new Error('User does not have the required permissions'))
        }
    }
}

exports.postTodo = (req, res, next) => {
    if (hasRequiredDelegatedPermissions(req.authInfo, authConfig.protectedRoutes.todolist.delegatedPermissions.write)
        ||
        hasRequiredApplicationPermissions(req.authInfo, authConfig.protectedRoutes.todolist.applicationPermissions.write)
    ) {
        try {
            db.get('todos').push(req.body).write();
            res.status(200).json({ message: "success" });
        } catch (error) {
            next(error);
        }
    } else (
        next(new Error('User or application does not have the required permissions'))
    )
}

exports.updateTodo = (req, res, next) => {
    if (isAppOnlyToken(req.authInfo)) {
        if (hasRequiredApplicationPermissions(req.authInfo, authConfig.protectedRoutes.todolist.applicationPermissions.write)) {
            try {
                const id = req.params.id;
    
                db.get('todos')
                    .find({ id: id })
                    .assign(req.body)
                    .write();
    
                res.status(200).json({ message: "success" });
            } catch (error) {
                next(error);
            }
        } else {
            next(new Error('Application does not have the required permissions'))
        }
    } else {
        if (hasRequiredDelegatedPermissions(req.authInfo, authConfig.protectedRoutes.todolist.delegatedPermissions.write)) {
            try {
                const id = req.params.id;
                const owner = req.authInfo['oid'];
    
                db.get('todos')
                    .filter({ owner: owner })
                    .find({ id: id })
                    .assign(req.body)
                    .write();
    
                res.status(200).json({ message: "success" });
            } catch (error) {
                next(error);
            }
        } else {
            next(new Error('User does not have the required permissions'))
        }
    }
}

exports.deleteTodo = (req, res, next) => {
    if (isAppOnlyToken(req.authInfo)) {
        if (hasRequiredApplicationPermissions(req.authInfo, authConfig.protectedRoutes.todolist.applicationPermissions.write)) {
            try {
                const id = req.params.id;
    
                db.get('todos')
                    .remove({ id: id })
                    .write();
    
                res.status(200).json({ message: "success" });
            } catch (error) {
                next(error);
            }
        } else {
            next(new Error('Application does not have the required permissions'))
        }
    } else {
        if (hasRequiredDelegatedPermissions(req.authInfo, authConfig.protectedRoutes.todolist.delegatedPermissions.write)) {
            try {
                const id = req.params.id;
                const owner = req.authInfo['oid'];
    
                db.get('todos')
                    .remove({ owner: owner, id: id })
                    .write();
    
                res.status(200).json({ message: "success" });
            } catch (error) {
                next(error);
            }
        } else {
            next(new Error('User does not have the required permissions'))
        }
    }
}
