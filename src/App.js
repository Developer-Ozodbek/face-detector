import { useEffect, useRef } from "react"
import * as tf from "@tensorflow/tfjs"
import * as facemash from '@tensorflow-models/face-landmarks-detection'
import Webcam from "react-webcam"
import { drawMesh } from "./utils"

const App = () => {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const runFacemesh = async() => {
    const net = await facemash.load(facemash.SupportedPackages.mediapipeFacemesh)
    setInterval(()=>{
      detect(net)
    }, 10)
  }

  const detect = async(net) => {
    if(
      typeof webcamRef.current !== "undefined" 
      && webcamRef.current !== null 
      && webcamRef.current.video.readyState == 4
    ) {
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight

      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      const face = await net.estimateFaces({input: video})
      console.log(face);

      const ctx = canvasRef.current.getContext("2d")
      requestAnimationFrame(()=>{
        drawMesh(face, ctx)
      })
    }
  }
  useEffect(()=>{
    runFacemesh()
  }, [])

  return (
    <div className='App'>
      <header className='App-header'>
        <Webcam ref={webcamRef} className='webcam' />
        <canvas ref={canvasRef} className='canvas' />
      </header>
    </div>
  )
}

export default App

