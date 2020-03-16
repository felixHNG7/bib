import React, {Component} from 'react';
import logo from './logo.svg';
import restaurantJson from './merged'
import './App.css';


class App extends Component{
  render(){
    return (
      <div>

        <center><font size="6">Here is the list of restaurants from Maitre Restaurant which has a bib gourmand distinction</font></center>
        {restaurantJson.map((detail, index)=>{
          return  <div class="card">
                      <div class="image">
                         <img src={detail.image}></img>
                      </div>

                      <div class="title">
                       <h2>{detail.name}</h2>
                      </div>

                      <div class="des">
                        {detail.localization}<br></br>
                        {detail.phone}<br></br>
                        <button><a href={detail.link}>Read More...</a></button>
                      </div>

                  </div>

        })}

      </div>
    );
  }
}

export default App;
