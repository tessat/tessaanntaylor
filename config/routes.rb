Tessaanntaylor::Application.routes.draw do
  root "pages#index"
  
  get '/dots', to: 'pages#dots'
  get '/font', to: 'pages#font'
end
