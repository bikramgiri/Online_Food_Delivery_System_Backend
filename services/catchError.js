// ** Code for handling errors asynchoronous 

module.exports = (fn)=>{
      return(req, res, next)=>{
            fn(req, res, next).catch((error)=>{
                  // **redirect to other page to show error message
                  // return res.send(error.message)
                  // or
                  return res.send("Something went wrong")

                  //** flash message in that page
                  // const path = req.route.path
                  // req.flash("error", "Something went wrong") 
                  // res.redirect(path) 
                  // return
            })
      }
      
}