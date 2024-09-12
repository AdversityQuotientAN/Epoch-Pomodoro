import { useEffect, useRef, useState } from 'react'
import './HomePage.scss'
import { FaSun } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
import { videos } from '../constants';
// import 'bootstrap/dist/css/bootstrap.min.css'

type TimeType = {
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number
}

const HomePage = () => {

    const [isRunning, setIsRunnning] = useState(false)
    const [isWorkTime, setIsWorkTime] = useState(true)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [elapsedBreakTime, setElapsedBreakTime] = useState(0)
    const intervalIdRef = useRef(0)
    const startTimeRef = useRef(0)
    const breakTimeRef = useRef(0)
    const [startTimeObj, setStartTimeObj] = useState<TimeType>({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
    const [breakTime, setBreakTime] = useState<TimeType>({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
    const startTimeInMillseconds = startTimeObj.milliseconds + startTimeObj.seconds * 1000 + startTimeObj.minutes * 1000 * 60 + startTimeObj.hours * 1000 * 3600
    const breakTimeInMillseconds = breakTime.milliseconds + breakTime.seconds * 1000 + breakTime.minutes * 1000 * 60 + breakTime.hours * 1000 * 3600
    const bottomRef = useRef()
    const [isLightMode, setIsLightMode] = useState(true)
    const backgroundImage = isLightMode ? 'images/background.jpg' : 'images/background1.jpg'
    const [currVideoNum, setCurrVideoNum] = useState(0)

    useEffect(() => {

        if (isRunning) {
            intervalIdRef.current = setInterval(() => {
                if (isWorkTime) {
                    setElapsedTime(Date.now() - startTimeRef.current)
                }
                else {
                    setElapsedBreakTime(Date.now() - breakTimeRef.current)
                }
            }, 10)
        }

        return () => {
            clearInterval(intervalIdRef.current)
        }

    }, [isRunning, isWorkTime])

    const start = () => {
        
        setIsRunnning(true)
        if (isWorkTime) {
            startTimeRef.current = Date.now() - elapsedTime
        }
        else {
            breakTimeRef.current = Date.now() - elapsedBreakTime
        }
    }
    const pause = () => {

        setIsRunnning(false)
    }
    const reset = () => {

        setElapsedTime(0)
        setElapsedBreakTime(0)
        setIsRunnning(false)
    }

    const resetTimes = () => {
        setStartTimeObj({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
        setBreakTime({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
    }

    const changeWorkTime = (e: { target: { value: string; name: string } }) => {

        const newVal = parseInt(e.target.value)
        if (isNaN(newVal)) {
            return
        }

        setStartTimeObj(prev => ({
            ...prev,
            [e.target.name]: newVal
        }))
    }
    const changeBreakTime = (e: { target: { value: string; name: string } }) => {

        const newVal = parseInt(e.target.value)
        if (isNaN(newVal)) {
            return
        }

        setBreakTime(prev => ({
            ...prev,
            [e.target.name]: newVal
        }))
    }


    const formatWorkTime = () => {
        
        if (isRunning && isWorkTime && elapsedTime >= startTimeInMillseconds) {
            setElapsedTime(0)
            setIsWorkTime(false)
            breakTimeRef.current = Date.now() - elapsedBreakTime
            setCurrVideoNum(prev => (prev + 1) % videos.length)
            setTimeout(() => {
                bottomRef.current.scrollIntoView({ behavior: 'smooth' })
            }, 500)
        }

        let hours: number | string = Math.floor((startTimeInMillseconds - elapsedTime) / (1000 * 60 * 60))
        let minutes: number | string = Math.floor((startTimeInMillseconds - elapsedTime) / (1000 * 60) % 60)
        let seconds: number | string = Math.floor((startTimeInMillseconds - elapsedTime) / 1000 % 60)
        let milliseconds: number | string = Math.floor(((startTimeInMillseconds - elapsedTime) % 1000))

        hours = String(hours).padStart(2, '0')
        minutes = String(minutes).padStart(2, '0')
        seconds = String(seconds).padStart(2, '0')
        milliseconds = String(milliseconds).padStart(3, '0')

        return `${hours}:${minutes}:${seconds}:${milliseconds}`
    }
    const formatBreakTime = () => {
        
        if (isRunning && !isWorkTime && elapsedBreakTime >= breakTimeInMillseconds) {
            setElapsedBreakTime(0)
            setIsWorkTime(true)
            startTimeRef.current = Date.now() - elapsedTime
        }

        let hours: number | string = Math.floor((breakTimeInMillseconds - elapsedBreakTime) / (1000 * 60 * 60))
        let minutes: number | string = Math.floor((breakTimeInMillseconds - elapsedBreakTime) / (1000 * 60) % 60)
        let seconds: number | string = Math.floor((breakTimeInMillseconds - elapsedBreakTime) / 1000 % 60)
        let milliseconds: number | string = Math.floor(((breakTimeInMillseconds - elapsedBreakTime) % 1000))

        hours = String(hours).padStart(2, '0')
        minutes = String(minutes).padStart(2, '0')
        seconds = String(seconds).padStart(2, '0')
        milliseconds = String(milliseconds).padStart(3, '0')

        return `${hours}:${minutes}:${seconds}:${milliseconds}`
    }

    const setLightMode = () => {
        setIsLightMode(prev => !prev)
    }

    return (
        <div
            className='pomodoroBody'
            style={{ backgroundImage: `url(${backgroundImage})`,
            height: `${isWorkTime ? '100vh' : '202.5vh' }` }}
        >
            <div className='lightButtonContainer'>
                <button onClick={setLightMode} className='lightButton'>{isLightMode ? <FaSun size='2rem' /> : <FaMoon size='2rem' />}</button>
            </div>
            <div className='pomodoro'>
                <div>
                    <button className='typeButton' onClick={() => setIsWorkTime(prev => !prev)}>{isWorkTime ? 'Work time' : 'Break time'}</button>
                </div>
                <div className='display'>{formatWorkTime()}</div>
                <div className='breakDisplay'>{formatBreakTime()}</div>
                <div className='controls'>
                    <button onClick={start} className='button-start'>Start</button>
                    <button onClick={pause} className='button-pause'>Pause</button>
                    <button onClick={reset} className='button-reset'>Stop</button>
                </div>
                <div className='templateContainer'>
                    <button className='template-button' onClick={() => {resetTimes(); setStartTimeObj(prev => ({...prev, minutes: 30}))}}>30 minutes</button>
                    <button className='template-button' onClick={() => {resetTimes(); setStartTimeObj(prev => ({...prev, seconds: 10}))}}>10 seconds</button>
                </div>
                <div className='setTimeContainer'>
                    <h3>Set work time</h3>
                    <label>Hours:</label>
                    <input type='number' name='hours' min={0} value={startTimeObj.hours} onChange={changeWorkTime}></input>
                    <label>Minutes:</label>
                    <input type='number' name='minutes' min={0} max={59} value={startTimeObj.minutes} onChange={changeWorkTime}></input>
                    <label>Seconds:</label>
                    <input type='number' name='seconds' min={0} max={59} value={startTimeObj.seconds} onChange={changeWorkTime}></input>
                    <label>Milliseconds:</label>
                    <input type='number' name='milliseconds' min={0} max={999} value={startTimeObj.milliseconds} onChange={changeWorkTime}></input>
                    <h3>Set break time</h3>
                    <label>Hours:</label>
                    <input type='number' name='hours' min={0} value={breakTime.hours} onChange={changeBreakTime}></input>
                    <label>Minutes:</label>
                    <input type='number' name='minutes' min={0} max={59} value={breakTime.minutes} onChange={changeBreakTime}></input>
                    <label>Seconds:</label>
                    <input type='number' name='seconds' min={0} max={59} value={breakTime.seconds} onChange={changeBreakTime}></input>
                    <label>Milliseconds:</label>
                    <input type='number' name='milliseconds' min={0} max={999} value={breakTime.milliseconds} onChange={changeBreakTime}></input>
                </div>
            </div>
            {!isWorkTime &&
            <>
                <div className='videoContainer'>
                    <iframe src={videos[currVideoNum]} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    <div className='breakDisplay'>{formatBreakTime()}</div>
                </div>
                <div className='bottomContainer' ref={bottomRef} />
            </>}
        </div>
    )
}

export default HomePage