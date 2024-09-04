import React, { useEffect, useRef, useState } from 'react'
import './HomePage.css'

// type Time = {
//     hours: number,
//     minutes: number,
//     seconds: number,
//     milliseconds: number
// }

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

    setMinutes = (minutes: number) => {
        this.minutes = minutes
    }

    inMilliseconds = (): number => {

        return this.milliseconds + this.seconds * 1000 + this.minutes * 1000 * 60 + this.hours * 1000 * 3600
    }
}

const HomePage = () => {

    const [isRunning, setIsRunnning] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0)
    const intervalIdRef = useRef(null)
    const startTimeRef = useRef(0)
    const [startTime, setStartTime] = useState<Time>(new Time())

    useEffect(() => {

        if (isRunning) {
            intervalIdRef.current = setInterval(() => {
                setElapsedTime(Date.now() - startTimeRef.current)
            }, 10)
        }

        return () => {
            clearInterval(intervalIdRef.current)
        }

    }, [isRunning])

    const start = () => {
        
        setIsRunnning(true)
        startTimeRef.current = Date.now() - elapsedTime
    }
    const pause = () => {

        setIsRunnning(false)
    }
    const reset = () => {

        setElapsedTime(0)
        setIsRunnning(false)
    }


    const formatTime = () => {
        
        if (isRunning && elapsedTime + 10 >= startTime.inMilliseconds()) {
            setIsRunnning(false)
            setElapsedTime(0)
            console.log("Done!")
        }

        let hours = Math.floor((startTime.inMilliseconds() - elapsedTime) / (1000 * 60 * 60))
        let minutes = Math.floor((startTime.inMilliseconds() - elapsedTime) / (1000 * 60) % 60)
        let seconds = Math.floor((startTime.inMilliseconds() - elapsedTime) / 1000 % 60)
        let milliseconds = Math.floor(((startTime.inMilliseconds() - elapsedTime) % 1000) / 10)

        hours = String(hours).padStart(2, '0')
        minutes = String(minutes).padStart(2, '0')
        seconds = String(seconds).padStart(2, '0')
        milliseconds = String(milliseconds).padStart(2, '0')

        return `${hours}:${minutes}:${seconds}:${milliseconds}`
    }

    return (
        <div className='pomodoro'>
            <div className='display'>{formatTime()}</div>
            <div className='controls'>
                <button onClick={start} className='button-start'>Start</button>
                <button onClick={pause} className='button-pause'>Pause</button>
                <button onClick={reset} className='button-reset'>Reset</button>
            </div>
            <div>
                <button onClick={() => {const newTime = new Time(); newTime.minutes = 30; setStartTime(newTime)}}>30 minutes</button>
                <button onClick={() => {const newTime = new Time(); newTime.seconds = 10; setStartTime(newTime)}}>10 seconds</button>
            </div>
        </div>
    )
}

export default HomePage