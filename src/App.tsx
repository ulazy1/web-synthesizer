import React, {
    useEffect,
    useRef,
    useState,
    MouseEventHandler, MutableRefObject,
} from 'react';

import Piano from './UIComponents/Piano';
import ControlBoxHeader from './UIComponents/ControlBoxHeader';
import OscillatorButton from './UIComponents/OscillatorButton';

import {FilterParams, FilterType} from './soundEngine/Filter';

import SingleKnobControl from './UIComponents/SingleKnobControl';
import ControlBox from './UIComponents/ControlBox';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faQuestion} from '@fortawesome/free-solid-svg-icons';

import sineWave from './assets/wave-sine.png';
import squareWave from './assets/wave-square.png';
import triangleWave from './assets/wave-triangle.png';
import {EnvelopeParams} from "./soundEngine/Envelope";
import {SoundEngine} from "./soundEngine/SoundEngine";
import {VoiceParams} from "./soundEngine/Voice";

import defaultParams from "./SynthPresets/default"


function App() {
    const soundEngine: MutableRefObject<SoundEngine | null> = useRef(null);
    const [volume, setVolume] = useState(50);
    const [envelopeParams, setEnvelopeParams] = useState<EnvelopeParams>(defaultParams.envelopeParams);
    const [filterParams, setFilterParams] = useState<FilterParams>(defaultParams.filterParams);
    const [oscillatorType, setOscillatorType] = useState<OscillatorType>(defaultParams.oscillatorParams);

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(Number(event.target.value));
        soundEngine.current?.setVolume(Number(event.target.value) / 100);
    };

    const handleFilterFrequencyChange = (val: number) => {
        setFilterParams((prevState) => {
            let newState : FilterParams = {
                ...prevState,
                frequency: val,
            }
            soundEngine.current?.changeFilterParams(newState);
            return newState
        });
    };

    const handleFilterQChange = (val: number) => {
        setFilterParams((prevState) => {
            let newState : FilterParams = {
                ...prevState,
                Q: val,
            }
            soundEngine.current?.changeFilterParams(newState);
            return newState
        });
    };

    const handleFilterTypeChange = (val: FilterType) => {
        setFilterParams((prevState) => {
            let newState : FilterParams = {
                ...prevState,
                type: val,
            }
            soundEngine.current?.changeFilterParams(newState);
            return newState
        });
    };

    const handleAttackChange = (val: number) => {
        setEnvelopeParams((prevState) => {
            let newState : EnvelopeParams = {
                ...prevState,
                attack: Number(val)
            }
            soundEngine.current?.changeEnvelopeParams(newState);
            return newState
        });
    };

    const handleDecayChange = (val: number) => {
        setEnvelopeParams((prevState) => {
            let newState : EnvelopeParams = {
                ...prevState,
                decay: Number(val)
            }
            soundEngine.current?.changeEnvelopeParams(newState);
            return newState
        });
    };

    const handleSustainChange = (val: number) => {
        setEnvelopeParams((prevState) => {
            let newState : EnvelopeParams = {
                ...prevState,
                sustain: Number(val)
            }
            soundEngine.current?.changeEnvelopeParams(newState);
            return newState
        });
    };

    const handleReleaseChange = (val: number) => {
        setEnvelopeParams((prevState) => {
            let newState : EnvelopeParams = {
                ...prevState,
                release: Number(val)
            }
            soundEngine.current?.changeEnvelopeParams(newState);
            return newState
        });
    };

    const handleOscillatorTypeChange = (type: OscillatorType) => {
        soundEngine.current?.changeOscillatorParams(type);
        setOscillatorType(type);
    };

    // setup sound engine class
    useEffect(() => {
        const audioContext = new AudioContext();
        const midiVoices =Array(13).fill(0).map((_, i) => i+60) ;
        const voiceParams: VoiceParams = {
            filterParams: filterParams,
            envelopeParams: envelopeParams,
            oscillatorParams: oscillatorType,
        }
        soundEngine.current = new SoundEngine(audioContext, {
            midiVoices: midiVoices,
            voiceParams: voiceParams
        })
    }, []);

    const pianoHeight = 180;

    const [modalVisible, setModalVisibility] = useState(false);
    const toggleModalVisible = () => {
        setModalVisibility((prevVisibility) => {
            return !prevVisibility;
        });
    };

    return (
        <div className='App h-full'>
            {/* help modal */}
            {modalVisible && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4'
                    onClick={toggleModalVisible}
                >
                    <div
                        className='bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-md z-50 overflow-auto'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='text-center'>
                            <h2 className='text-2xl font-bold mb-4'>About</h2>
                            <p className='mb-4'>
                                Oscillator icons are created by{' '}
                                <a href='https://www.flaticon.com/authors/judanna'>
                                    <em className='not-italic text-primary-content hover:underline underline-offset-4'>
                                        judanna
                                    </em>
                                </a>{' '}
                            </p>
                            <p className='mb-4'>
                                Oscillator icons are created by{' '}
                                <a href='https://www.flaticon.com/authors/iconading'>
                                    <em className='not-italic text-primary-content hover:underline underline-offset-4'>
                                        iconading
                                    </em>
                                </a>{' '}
                            </p>

                            <button className='btn' onClick={toggleModalVisible}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* navbar */}
            <nav className='px-2 pt-2 flex items-center justify-between bg-base-100'>
                <div className='navbar-start'>
                    <a href='/' className='btn btn-ghost normal-case text-xl'>
                        Synthesizer
                    </a>
                </div>
                <div
                    className='mr-2 h-8 w-8 bg-slate-900 rounded-full flex items-center justify-center hover:cursor-pointer hover:bg-slate-800'
                    onClick={toggleModalVisible}
                >
                    <FontAwesomeIcon icon={faQuestion} size='1x'/>
                </div>
            </nav>
            <main>
                <div
                    className={`flex flex-col gap-5 pt-6`}
                    style={{paddingBottom: `${pianoHeight + 16}px`}}
                >
                    <div className='mx-auto container px-6 grid grid-cols-2 gap-2'>
                        <ControlBox>
                            <ControlBoxHeader text='Oscillator Type'></ControlBoxHeader>
                            <div className='flex items-center justify-center w-full gap-6 desktop:gap-12'>
                                <OscillatorButton
                                    text='Sine'
                                    src={sineWave}
                                    onChange={() => handleOscillatorTypeChange('sine')}
                                    selected={oscillatorType === 'sine'}
                                ></OscillatorButton>
                                <OscillatorButton
                                    src={squareWave}
                                    text='Square'
                                    onChange={() => handleOscillatorTypeChange('square')}
                                    selected={oscillatorType === 'square'}
                                ></OscillatorButton>
                                <OscillatorButton
                                    text='Triangle'
                                    src={triangleWave}
                                    onChange={() => handleOscillatorTypeChange('triangle')}
                                    selected={oscillatorType === 'triangle'}
                                ></OscillatorButton>
                            </div>
                        </ControlBox>

                        <ControlBox>
                            <ControlBoxHeader text={`Gain: ${volume}`}></ControlBoxHeader>
                            <input
                                type='range'
                                min={0}
                                max='100'
                                value={volume}
                                className='range'
                                onChange={handleVolumeChange}
                            />
                        </ControlBox>

                        <ControlBox>
                            <ControlBoxHeader text='Amplitude Envelope'></ControlBoxHeader>
                            <div className='flex gap-6'>
                                <SingleKnobControl
                                    text='Attack'
                                    defaultVal={defaultParams.envelopeParams.attack}
                                    minVal={0.01}
                                    maxVal={1}
                                    step={0.01}
                                    sensitivity={0.25}
                                    onChange={handleAttackChange}
                                ></SingleKnobControl>
                                <SingleKnobControl
                                    text='Decay'
                                    defaultVal={defaultParams.envelopeParams.decay}
                                    minVal={0.01}
                                    maxVal={1}
                                    step={0.01}
                                    sensitivity={0.25}
                                    onChange={handleDecayChange}
                                ></SingleKnobControl>
                                <SingleKnobControl
                                    text='Sustain'
                                    defaultVal={defaultParams.envelopeParams.sustain}
                                    minVal={0.01}
                                    maxVal={1}
                                    step={0.01}
                                    sensitivity={0.25}
                                    onChange={handleSustainChange}
                                ></SingleKnobControl>
                                <SingleKnobControl
                                    text='Release'
                                    defaultVal={defaultParams.envelopeParams.release}
                                    minVal={0.01}
                                    maxVal={1}
                                    step={0.01}
                                    sensitivity={0.25}
                                    onChange={handleReleaseChange}
                                ></SingleKnobControl>
                            </div>
                        </ControlBox>

                        <ControlBox>
                            <ControlBoxHeader text='Filter'></ControlBoxHeader>
                            <div className='flex gap-6'>
                                <SingleKnobControl
                                    text='Freq'
                                    defaultVal={defaultParams.filterParams.frequency}
                                    minVal={20}
                                    maxVal={2000}
                                    step={5}
                                    sensitivity={0.5}
                                    onChange={handleFilterFrequencyChange}
                                ></SingleKnobControl>
                                <SingleKnobControl
                                    text='Resonance'
                                    defaultVal={defaultParams.filterParams.Q}
                                    minVal={0.1}
                                    maxVal={10}
                                    step={0.1}
                                    sensitivity={0.5}
                                    onChange={handleFilterQChange}
                                ></SingleKnobControl>
                            </div>
                        </ControlBox>

                        <ControlBox>
                            <ControlBoxHeader text='Effects'></ControlBoxHeader>
                        </ControlBox>

                        <ControlBox>
                            <ControlBoxHeader text='LFO'></ControlBoxHeader>
                        </ControlBox>
                    </div>
                </div>
                <div
                    className={`fixed bottom-0 w-full`}
                    style={{height: `${pianoHeight}px`}}
                >
                    <Piano
                        mouseDownCallbackCreator={(note: number) => {
                            const callback: MouseEventHandler = (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                soundEngine.current?.play(note);
                            };
                            return callback;
                        }}
                        mouseUpCallbackCreator={(note: number) => {
                            const callback: MouseEventHandler = (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                soundEngine.current?.stop(note);
                            };
                            return callback;
                        }}
                    ></Piano>
                </div>
            </main>
        </div>
    );
}

export default App;
