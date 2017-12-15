import React from 'react';
import axios from 'axios';

// const ChildComponent = React.createClass({
//     render: function() {
//       <ul className="posts">
//         {this.props.posts.map(function(post){
//           return (
//             <li>
//               <h3>{post.title}</h3>
//               <p>{post.content}</p>
//             </li>
//           )
//         })}
//       </ul>
//     }
//   })
  
//   const ChildComponentContainer = React.createClass({
//     getInitialState: function() {
//       return {
//         posts: []
//       }
//     },
//     componentWillMount: function() {
//       axios.get(this.props.url, function(resp) {
//         this.setState({
//           posts: resp.data
//         });
//       }.bind(this));
//     },
//     render: function() {
//       return (
//         <ChildComponent posts={this.state.posts} />
//       )
//     }
//   })

// export default ChildComponentContainer;

function getUserAccount() {
    return axios.get('/user/12345');
} 
   
function getUserPermissions() {
    return axios.get('/user/12345/permissions');
}
   
axios.all([getUserAccount(), getUserPermissions()])
.then(axios.spread(function (acct, perms) {
    // Both requests are now complete 
}));