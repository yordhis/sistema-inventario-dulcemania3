const isLogged = (req, res, next) => {
    let logged = req.session.rol
    console.log(logged)
    if ( logged.rol ) {
        next()
    } else {
        res.redirect('/')
    }
}

exports.isLogged = isLogged