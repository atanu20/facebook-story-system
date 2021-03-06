import React,{useState,useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Navbar.css'
import axios from 'axios';
const Navbar = ({home}) => {
    const [postimg, setPostimg] = useState([])
    const [myPro, setMyPro] = useState([])
    const [postprev, setPostprev] = useState(false)
    const [loading, setLoading] = useState(false)
const [submitbtn,setSubmitBtn] = useState(false)
    const StoryUserId=localStorage.getItem('StoryUserId')

    const notify = (msg) => toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        });

        const checkUpload=async()=>{
            const res=await axios.get(`http://localhost:8000/checkupload/${StoryUserId}`)
            // console.log(res.data)
            if(res.data.submit)
            {
                setSubmitBtn(true)
            }
            else{
                setSubmitBtn(false)
            }
        }
        const mypro=async()=>{
            const res=await axios.get(`http://localhost:8000/myprofile/${StoryUserId}`)
            setMyPro(res.data)
        }

        useEffect(() => {
            if(StoryUserId)
            {
                checkUpload()
            mypro()
            }
            
        }, [])


    const handelImg=(e)=>{
        const { files } = e.target
        if (files.length > 0) {
            setPostimg(files[0])
            setPostprev(true)
           
        } 
    }


    const postSub=async(e)=>{
        e.preventDefault()
        setPostprev(false)
        setLoading(true)
      
        let formData=new FormData();
        formData.append("postimg",postimg)
        formData.append("user_id",StoryUserId)
        let res=await axios.post("http://localhost:8000/uploadpost",formData);
        // console.log(res.data)
        if(res.data.submit)
        {
           
            
           setPostimg([])
           setLoading(false)
           window.location.reload()
        }else{
            notify(res.data.msg)
            
            setPostimg([])
            setLoading(false)
        }
        

    }

    const  Logout=()=>{
        localStorage.removeItem("StoryUserId");
        localStorage.removeItem("StoryEmail");
        localStorage.removeItem("StoryUser");
        localStorage.removeItem("Storytoken");
        
        window.location.reload()
        // history.push("/")
       }

    return (
        <>
        <div className="topbar">
            <div className="logo">
                <NavLink to="/"><h2>FaceBook Story</h2></NavLink>
            </div>
            <div className="right">
                <button className="btn btn-dark mr-2" onClick={Logout}>LogOut</button>
                {
                    home && <button className="btn btn-dark" type="button" disabled={submitbtn} data-toggle="modal" data-target="#myModal">Upload Story</button>
                }
                
               
                    <img src={myPro.profilePicture ? `http://localhost:8000/images/profile/${myPro.profilePicture}` : `../image/pro.png`} alt="" className="proimg" />
               


                <div class="modal fade" id="myModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
      
       
        <div class="modal-header">
          <h4 class="modal-title text-dark">Upload File</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        
        
        <div class="modal-body text-dark">

        {
                    postprev ? <div className="imgbox">
                    <img src={URL.createObjectURL(postimg)} alt="" className="postim" />                
                    </div> : null

                }
                {
                     loading && <div className="lodbox"> <CircularProgress  /> <br/></div> 
                 }

        <label htmlFor="file" >
                            <p className="textb">Upload Story</p>
                            <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={handelImg}
              />
                        </label>
        </div>
        
        
        <div class="modal-footer">
          <button type="button" class="btn btn-dark" onClick={postSub} >Post Now</button>
        </div>
        
      </div>
    </div>
  </div>
            </div>
        </div>
            <ToastContainer/>
        </>
    )
}

export default Navbar
