import react, { useEffect, useState } from 'react';
import book from '../Images/book.webp';
import '../Styles/Home.css';
import lib from '../Images/lib.jpg';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import 'bootstrap/dist/css/bootstrap.min.css';  
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Row,Col, ProgressBar,Modal ,Button,Offcanvas} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import axios from 'axios';
import libraray from '../Images/library.jpg';


export default function Home(){

   const[modal,setModal]=useState(false);
   const[success,setSuccess]=useState(false);
   const[returndate,setReturndate]=useState('');
   const[curdate,setCurdate]=useState('');
   const[due,setDue]=useState('');
   const[tree,setTree]=useState('');
   const[schema,setSchema]=useState(false);
    
   const api="https://library-1-a4gx.onrender.com";

   const handleModal=()=>
   {
       setModal(true);
   }
   const handleClose=()=>
   {
      setModal(false);
      setModal1(false);
      setValue("");
      setMember(false);
      setCurdate("");
      setReturndate("");
      setDue("");
      setTree(false);
      setSchema(false);
   }
   const uploadfile=()=>
   {
      document.getElementById("file").click();
   }
   const [pdf,setPdf]=useState('');
   const [bookname,setBookname]=useState('');
   const [author,setAuthor]=useState('');
   const [code,setCode]=useState('');
   const [modal1,setModal1]=useState(false);
   const [selected,setSelected]=useState("TRANSACTION");
   const [transaction,setTransaction]=useState("");
   
   
   const handlebook=async(e)=>
   {
       const{name,value}=e.target;
       if(name==="bookname")
       {
          setBookname(value);
       }
       if(name==="author")
       {
        setAuthor(value);
       }
       if(name==="code")
       {
        setCode(value);
       }
       if(name==="file")
       {
         setPdf(e.target.files[0]);
       }
      if (e.target.value === "Book Issue") {
         setModal1(true);    
         setTransaction("Issue");
      }
      if (e.target.value === "Book Return") {
         setModal1(true);    
         setTransaction("Return");
      }
      if (e.target.value === "Remove Book") {
         setModal1(true);    
         setTransaction("Delete");
      }
      if (e.target.value === "Book Search") {
         setModal1(true);    
         setTransaction("Search");
      }
      
    }
    const uploadbook=async(e)=>
    {
      const formData = new FormData();
      formData.append('name', bookname);  // Book name
      formData.append('author', author);  // Author name
      formData.append('code', code);      // Book code
      formData.append('pdf', pdf);  
        try
       {
          console.log(pdf);
          const res=await axios.post(`${api}/bookadd`,formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Required for file uploads
            },
        });
          if(res.status===200)
          {
             setSuccess(true);
             alert("Book Added succefully");
          }
       }
       catch(error)
       {
         console.error(error);
       }
       
    }
    const[member,setMember]=useState(false);
    const newmember=()=>{
       setMember(true);
    }
    const[value,setValue]=useState("");
    const autoId=()=>
    {
        const num= Math.floor(10000000+Math.random()*90000000);
        setValue(num);
    }
    const[canvas,setcanvas]=useState(false);
    const images=[lib,book];
    const[data,setData]=useState("");
    const viewbooks=async()=>
    {
        setcanvas(true);
        try
        {
         const res=await axios.get(`${api}/getBooks`);
         console.log(res.data);
         if(res.status===200){
         const books=res.data.map((book,index)=>({
             ...book,
             image:images[index%images.length],
         }))
         console.log(books);
         setData(books);
         }
        }
        catch(err)
        {
          console.error(err);
        }


    }
    const closeView=()=>{ setcanvas(false); }
    const[memberName,setMemberName]=useState('');
    const[std,setStd]=useState('');
    const[addr,setAddr]=useState('');
   //  const[id,setId]=useState('');
    const handleMember=async()=>
    {
       const data={name:memberName,std:std,addr:addr,id:value};
       console.log(data);
       try{
      const resp=await axios.post(`${api}/savemember`,data);
      if(resp.status===200)
      {
         setModal(false);
         alert('Member added');
      }
   }
      catch(error)
      {
         console.error(error);
      }
    }
    const searchMember=async()=>
    {
      //  const data={name:memberName,id:value};
      try{
       const res=await axios.get(`${api}/getmember`,{params:{id:value}});
       console.log(res.data[0].bookCode);
       const response=await axios.get(`${api}/bookname`,{params:{code:res.data[0].bookCode}});
    
                if(res.status===200 && response.status===200)
                {
                    setCurdate(res.data[0].actualReturnDate);
                    setReturndate(res.data[0].expectedReturnDate);
                    setDue(res.data[0].due);
                    setBookname(response.data[0].name);
                    setModal(false);
                    setSchema(true);
                }
                else
                {
                  alert('Library Id not found!!!');
                }
      }
      catch(err){
            console.log(err);
      }

       
    }
   
   const dateIssue=()=>
   {
       const date = new Date().toISOString().split('T')[0];
       setIssuedate(date);
   }
   const[isseudate,setIssuedate]=useState('');
   const dateReturn=()=>
   {
      const today = new Date(); 
      today.setDate(today.getDate()+15);
      const year = today.getFullYear(); 
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setReturndate(year+"-"+month+"-"+day);
   }
    const handleIssue=async()=>{

      const data={id:value,code:code,issue:isseudate,returndate:returndate};
      try{
         const res=await axios.post(`${api}/bookissue`,data);
         setModal1(false);

      }
      catch(error)
      {
          console.log(error);
      }
    }

    const returnBook=async()=>{
          
       const data={code:code,id:value};
       console.log(data);
        try{
             const res=await axios.get(`${api}/bookissue`,{params:data});
             setReturndate(res.data[0].returndate);
        }
        catch(error)
        {
          console.error(error);
        }
    }
    const returncal=()=>{ const date = new Date().toISOString().split('T')[0]; setCurdate(date);}
    const dueCalculate=()=>
    {
         
           const currentdate=new Date(curdate);
           const retdate=new Date(returndate);
           const diifMns=currentdate-retdate;
           console.log(diifMns);
           const diffDate=diifMns/(1000*60*60*24);
           console.log(diffDate);
           const finalDays = diffDate < 0 ? 0 : diffDate;
           const total=finalDays*5;
           console.log(total);
           setDue(total);
    }
    const handleReturn=async()=>{
        
        const data={id:value,code:code,expectedReturndate:returndate,returndate:curdate,due:due};
        try{
            const res=await axios.post(`${api}/returnbook`,data);
            if(res.status===200)
            {
                const resp=await axios.delete(`${api}/bookissue`,{params:{code:code}});
                if(resp.status===200)
                {
                  alert('Book return succefully');
                }
            }
        }
        catch(error)
        {
          console.log(error);
        }
    }
    const[avalability,setAvalability]=useState(false);
    const checkBook=async(code)=>{

       try{
             const res=await axios.get(`${api}/checkbook`,{params:{code:code}});
             if(res.status===200)
             {
                setAvalability(true);
             }
             else{
                setAvalability(false);
             }
          }
       catch(err)
       {
          console.log(err);
       }    
    }
    
    
    const bookSearch=async()=>{

       console.log(code);
        try{
             const response=await axios.get(`${api}/getbook`,{params:{code:code}});
             const res=await axios.get(`${api}/checkbook`,{params:{code:code}});
             if (response.status === 200) {
               setBookname(response.data[0].name);
               setAuthor(response.data[0].author);
           }
   
           if (res.data===0) {
               setAvalability(true);
           } else {
               setAvalability(false);
           }
   
           setModal1(false);
           setTree(true);
       } catch (err) {
           console.error("Error occurred:", err);
           setAvalability(false);
       }
    }
    const deleteBook=async()=>{
           
         try{
             const res=await axios.delete(`${api}/deletebook`,{params:{code:code}});
             if(res.status===200)
             {
                setModal1(false);
                alert("Book Deleted Succefully");
             }
             else{
                alert("Error:Book code not found!!!");
             }
         }
         catch(err)
         {
             console.error(err);
         }
    }
   return(
      <>
      <div className='body'>
      <div style={{display:'flex'}} className="container-fluid">
      <img src={book} className='bookimg'></img>
      <p className='textlib'>LIBRARAY<br></br>MANAGEMENT SYSTEM</p>
      <AccountCircleIcon className='icon'/>
      <Link to='/' style={{textDecoration:'none'}}><p className='admin'>Admin</p></Link>
      </div>
       <div className='divd'>
        <Link to='/home' style={{color:'white'}}><label className='home'> HOME</label></Link>
        <label className='member' style={{marginLeft:'20px'}} onClick={handleModal}> MEMBER </label>
        <select className='transact' style={{marginLeft:'20px',backgroundColor:'#f57c00',color:'white',borderColor:'#f57c00'}} onChange={handlebook} value={selected}>
         <option disabled>TRANSACTION</option>
         <option>Book Issue</option>
         <option>Book Return</option>
         <option>Remove Book</option>
         <option>Book Search</option>
        </select>
        <ViewStreamIcon className='view' onClick={viewbooks}></ViewStreamIcon>
       </div>
       <img src={lib} className='libray'></img>
         <div className='upload'>
            <div className='books'>
         <p>ADD BOOK</p>
             <label>Book Name:</label><input type='text' name='bookname' onChange={(e)=>handlebook(e)}></input><br></br><br></br>
             <label>Author:</label><input type='text' className='author' name='author'onChange={(e)=>handlebook(e)} ></input><br></br><br></br>
             <label>Book Code:</label><input type='text' name='code'onChange={(e)=>handlebook(e)}></input><br></br><br></br>
             </div>
             <div className='uploadbook'><CloudUploadIcon className='cloud' onClick={uploadfile}/><p>Upload</p>
            <input type='file' accept="application/pdf" id='file' style={{display:'none'}} name='file' onChange={(e)=>handlebook(e)}></input>
            <p>{pdf.name}</p>
            {success &&<p style={{color:'green'}}>Book Added succefully</p>}
            {success===false &&<p style={{color:'red'}}>Add book pdf also</p>}
            <button onClick={uploadbook}>Add Book</button>
            </div>
         </div>
         <div className='rules'>
         <p>The DOs and DON'Ts of the Library</p>
         <p>To ensure everybody will enjoy using the library, we set up a few rules to be followed. 
         Everyone must follow these simple rules.  Enjoy your stay in our cool and nice library!</p>
         <div class="container" style={{marginBottom:'40px'}}>
         <Row>
            <Col xs={12} md={6}>
            <Row  className='dos'>DOS</Row>
            <div className='true'>
             <Row>Treat the books and other materials with care</Row>
              <Row>Return Books on time</Row>
              <Row>Ask for help if you can't find what you need</Row>
              <Row>Speak quitly so you don't disturb others</Row>
              </div>
            </Col>
            <Col xs={12} md={6}>
               <Row className='donts'>DON'Ts</Row>
               <div className='false'>
               <Row>Do not bring foods, and drink inside</Row>
               <Row>Don't run ,just walk</Row>
               <Row>Do not use computers for gaming purpose only</Row>
               <Row>Don't take phonecalls when your inside the library</Row>
               </div>
            </Col>
         </Row>
         </div>
         </div>
         {/* <img src={card} className='card'></img> */}
         <div className='quote'>
         <h2>"When I got my library card,that day my life begin"</h2>
         <h4>-Rita Mae Brown</h4>
         </div>
         
         <div className='divt'>
            <label className='label1'>Copyrights 2024,All rights are reserved</label>
            <label className='label2'>Powered by NSN Technology</label>
         </div>

         <Modal show={modal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          {member?<Modal.Title>ADD NEW MEMBER</Modal.Title>:
          <Modal.Title>SEARCH MEMBER</Modal.Title>}
        </Modal.Header>
        <Modal.Body>
            {member?
            <div className='divm'>
            <label>Enter Name:</label><input type='text'required className='namec' onChange={(e)=>setMemberName(e.target.value)}></input><br></br><br></br>
            <label>Standard:</label><input type='text'required className='std'  onChange={(e)=>setStd(e.target.value)}></input><br></br><br></br>
            <label>Address:</label><input type='text' required className='addr'  onChange={(e)=>setAddr(e.target.value)}></input><br></br><br></br>
            <label>Enter Library Id:</label><input type="text" className='idr' required onMouseUpCapture={autoId} value={value}></input><br></br><br></br>
            <button className='newmember' onClick={()=>{setMember(false); setValue("")}}>Back</button>
            </div>
            :(
               <>
            <lable>Enter Name:</lable><input type='text'required className='name' onChange={(e)=>setMemberName(e.target.value)}></input><br></br><br></br>
            <label>Enter Library Id:</label><input type="text" required className='id' onChange={(e)=>setValue(e.target.value)}></input><br></br><br></br>
            <button className='newmember' onClick={newmember}>New member?Click</button>
            </>
            )}
        </Modal.Body>
        <Modal.Footer>
         <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {member?<Button onClick={handleMember}>Submit</Button>:
          <Button onClick={searchMember}>Submit</Button>}
        </Modal.Footer>
      </Modal> 
      {/* Issue book */}
      <Modal show={modal1} onHide={handleClose} centered dialogClassName="modal-custom"> 
        <Modal.Header closeButton>
         { transaction==="Issue" &&<Modal.Title>BOOK ISSUE</Modal.Title>}
         { transaction==="Return" &&<Modal.Title>BOOK RETURN</Modal.Title>}
         { transaction==="Search" &&<Modal.Title>BOOK SEARCH</Modal.Title>}
         { transaction==="Delete" &&<Modal.Title>REMOVE BOOK</Modal.Title>}
        </Modal.Header>
        <Modal.Body>
         {transaction==="Issue" &&
            <div className='textt'>
            <label style={{fontWeight:'bold',fontFamily:'sans-serif'}}>Library ID:</label><input type='text' className='libId' onChange={(e)=>setValue(e.target.value)}></input><br></br><br></br>
            <label style={{fontWeight:'bold',fontFamily:'sans-serif'}}>Book code:</label><input type='text' className='code' onChange={(e)=>setCode(e.target.value)} onMouseLeave={(e)=>checkBook(e.target.value)}></input><br></br>{avalability && <p style={{color:'green'}}>Book Available</p>}{avalability===false && <p style={{color:'red'}}>Book Not Available</p>}
            <label style={{fontWeight:'bold',fontFamily:'sans-serif'}}>Issuing Date:</label><input type='text' className='date1' onMouseEnter={avalability === true ? dateIssue : null}
               value={avalability === true ? isseudate : ''}
               disabled={!avalability}></input><br></br><br></br>
                        <label style={{fontWeight:'bold',fontFamily:'sans-serif'}}>Return Date:</label><input type='text' className='date2' onMouseEnter={avalability === true ? dateReturn : null}
               value={avalability === true ? returndate : ''}
               disabled={!avalability}></input><br></br><br></br>
            </div>
         }
         {transaction==="Return" &&
            <div className='textt'>
            <label style={{fontWeight:'bold',fontFamily:'sans-serif'}}>Library ID:</label><input type='text' className='text1'onChange={(e)=>setValue(e.target.value)}></input><br></br><br></br>
            <label style={{fontWeight:'bold',fontFamily:'sans-serif'}}>Book code:</label><input type='text' className='text2' onChange={(e)=>setCode(e.target.value)}></input><br></br><br></br>
            <label style={{fontWeight:'bold',fontFamily:'sans-serif'}}>Expected Return Date:</label><input type='text'className='text3' onMouseEnter={returnBook} value={returndate}></input><br></br><br></br>
            <label style={{fontWeight:'bold',fontFamily:'sans-serif'}}>Actual Return Date:</label><input type='text'className='text4' onMouseEnter={returncal} value={curdate} ></input><br></br><br></br>
            <label style={{fontWeight:'bold',fontFamily:'sans-serif'}}>Due:</label><input type='text' className='text5'onMouseEnter={dueCalculate} value={due}></input>
            <p style={{color:'red'}}>Note:for every delay in date will charge 5Rs/- per day</p>
            </div>
         }
         {(transaction==="Search")&&
            <div className='textt'>
            <label style={{fontWeight:'bold',fontFamily:'sans-serif'}}>Book code:</label><input type='text' onChange={(e)=>setCode(e.target.value)}></input><br></br><br></br>
            </div>
         }
         {(transaction==="Delete" )&&
            <div className='textt'>
            <label style={{fontWeight:'bold',fontFamily:'sans-serif'}}>Book code:</label><input type='text' onChange={(e)=>setCode(e.target.value)}></input><br></br><br></br>
            </div>
         }

            </Modal.Body>
        <Modal.Footer>
         <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          {transaction==="Issue" && <Button onClick={handleIssue}>Issue</Button>}
          {transaction ==="Return" &&<Button onClick={handleReturn}>Return</Button>}
          {(transaction==="Search" )&& <Button onClick={bookSearch}>Search</Button>}
          {(transaction==="Delete" )&& <Button onClick={deleteBook}>Delete</Button>}
        </Modal.Footer>
      </Modal> 
         
      <Offcanvas show={canvas} onHide={closeView} placement='end' scroll className='canvas'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>ALL BOOKS</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{backgroundColor:'black',color:'white'}}>
         {data &&<Row style={{fontWeight:'bold'}} className='rowname'>
            {/* <Col xs={4}></Col> */}
            <Col>BOOK NAME</Col>
            <Col>BOOK CODE</Col>
         </Row>}
         
      {Array.isArray(data) && data.length > 0 ? (
        data.map((book, index) => (
         <Row style={{marginTop:'4px'}} className='rowcode'>
            <Col><img src={book.image} className='bookimage'></img> {book.name}</Col>
            {/* <Col>{book.name}</Col> */}
            <Col>{book.code}</Col>
          </Row>
        ))
      ) : (
        <p>No books available</p>
      )}
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={tree} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
               <Row style={{fontWeight:'bold'}} className='tree'>
                  <Col>NAME</Col>
                  <Col>CODE</Col>
                  <Col>AUTHOR</Col>
                  <Col>AVAILABILITY</Col>
               </Row>
               <Row className='tree1'>
                   <Col>{bookname}</Col>
                   <Col>{code}</Col>
                   <Col>{author}</Col>
                   {avalability===true?<Col style={{color:'green'}}>Available</Col>:
                   <Col style={{color:'red'}}>Not Available</Col>}
               </Row>
        </Modal.Body>
      </Modal> 
         
      <Modal show={schema} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>MEMBER DETAILS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
               <label>NAME: {memberName}</label><br></br>
               <label>LIBRARAY ID: {value}</label>
                <p style={{fontWeight:'bold',textAlign:'center',color:'#f57c00'}}>BOOK TRANSACTION</p>
                 <Row className='schema'>
                  <Col>NAME</Col>
                  <Col>EXPECTED RETURN DATE</Col>
                  <Col>DATE OF RETURN</Col>
                  <Col>DUE</Col>
                 </Row>
                 <Row className='schema1'>
                  <Col>{bookname}</Col>
                  <Col>{returndate}</Col>
                  <Col>{curdate}</Col>
                  <Col>{due}.00</Col>
                 </Row>
        </Modal.Body>
      </Modal> 
         </div>
      </>
   )
}