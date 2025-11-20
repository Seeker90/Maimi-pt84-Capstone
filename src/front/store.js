export const initialStore=()=>{
  return{
    token: null,
    isLoginSuccessful: false,
    message: '',
    isSignUpSuccessful: false,
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
   case 'fetchedToken':
    {
      //retreive information from payload
      const{ token, isLoginSuccessful } = action.payload;
      return {
        ...store,
        token: token,
        isLoginSuccessful: isLoginSuccessful,  //true
      }
    }
    default:
      throw Error('Unknown action.');
  }    
}
