import Route from 'vue-routisan'
import auth from '@imagina/quser/_router/middlewares/auth' //Middleware auth
import access from '@imagina/quser/_router/middlewares/access' //Middleware access


/*VIEWS*/
import home from 'src/layouts/master'


//Routes for offline
Route.view('/offline', home)
  .guard(auth)
  .children(() => {
    Route.view('/', require('../_layouts/offline').default).name('offline');
    }
  )



export default Route.all()