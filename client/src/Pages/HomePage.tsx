import React, { useEffect, useRef, useState } from 'react'
import './HomePage.scss'
// import 'bootstrap/dist/css/bootstrap.min.css'

type TimeType = {
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number
}

class Time {

    hours
    minutes
    seconds
    milliseconds

    constructor() {
        this.hours = 0
        this.minutes = 0
        this.seconds = 0
        this.milliseconds = 0
    }

    setHours = (hours: number) => {
        this.hours = hours
    }
    setMinutes = (minutes: number) => {
        this.minutes = minutes
    }
    setSeconds = (seconds: number) => {
        this.seconds = seconds
    }
    setMilliseconds = (milliseconds: number) => {
        this.milliseconds = milliseconds
    }

    inMilliseconds = (): number => {

        return this.milliseconds + this.seconds * 1000 + this.minutes * 1000 * 60 + this.hours * 1000 * 3600
    }
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
    const bottomRef = useRef(null)

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

    const changeWorkTime = (e) => {

        const newVal = parseInt(e.target.value)
        if (isNaN(newVal)) {
            return
        }

        setStartTimeObj(prev => ({
            ...prev,
            [e.target.name]: newVal
        }))
        // console.log(startTimeObj)
    }
    const changeBreakTime = (e) => {

        const newVal = parseInt(e.target.value)
        if (isNaN(newVal)) {
            return
        }

        setBreakTime(prev => ({
            ...prev,
            [e.target.name]: newVal
        }))
        // console.log(startTimeObj)
    }


    const formatWorkTime = () => {
        
        if (isRunning && isWorkTime && elapsedTime >= startTimeInMillseconds) {
            setElapsedTime(0)
            setIsWorkTime(false)
            breakTimeRef.current = Date.now() - elapsedBreakTime
            setTimeout(() => {
                bottomRef.current.scrollIntoView({ behavior: 'smooth' })
            }, 500)
        }

        let hours = Math.floor((startTimeInMillseconds - elapsedTime) / (1000 * 60 * 60))
        let minutes = Math.floor((startTimeInMillseconds - elapsedTime) / (1000 * 60) % 60)
        let seconds = Math.floor((startTimeInMillseconds - elapsedTime) / 1000 % 60)
        let milliseconds = Math.floor(((startTimeInMillseconds - elapsedTime) % 1000))

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

        let hours = Math.floor((breakTimeInMillseconds - elapsedBreakTime) / (1000 * 60 * 60))
        let minutes = Math.floor((breakTimeInMillseconds - elapsedBreakTime) / (1000 * 60) % 60)
        let seconds = Math.floor((breakTimeInMillseconds - elapsedBreakTime) / 1000 % 60)
        let milliseconds = Math.floor(((breakTimeInMillseconds - elapsedBreakTime) % 1000))

        hours = String(hours).padStart(2, '0')
        minutes = String(minutes).padStart(2, '0')
        seconds = String(seconds).padStart(2, '0')
        milliseconds = String(milliseconds).padStart(3, '0')

        return `${hours}:${minutes}:${seconds}:${milliseconds}`
    }

    return (
        <>
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
                    <iframe src="https://www.theepochtimes.com/epochtv/can-our-brains-change-the-dr-monti-show-5082010?utm_source=ref_share&utm_campaign=copy" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    <div className='breakDisplay'>{formatBreakTime()}</div>
                </div>
                <div className='bottomContainer' ref={bottomRef} />
            </>}
        </>
    )
}

export default HomePage