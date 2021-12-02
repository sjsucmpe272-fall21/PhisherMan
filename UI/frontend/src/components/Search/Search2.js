import React, { useState, useEffect } from 'react';
import axios from "axios";
function Search2 () {
    const [students,setStudents] = useState({
        data: '',
        loading: true
    })
    const [name,setName] = useState('')
    
    const handleClick = async() => {
        const data = await axios.get('https://jsonplaceholder.typicode.com/todos').then(res =>
        console.log(res)
        )

        setStudents({
            data: data,
            loading: false
        })
    }
    
    return (
        <div className="container">
            <h2>Example component</h2>
            <button onClick = {handleClick}>Get students</button>
            <div>
                {students.loading?'':
                students.data.data[0].name}
            </div>
        </div>
    );
}
export default Search2;