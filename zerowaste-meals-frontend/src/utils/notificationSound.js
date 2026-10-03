/**
 * Plays the notification chime when a notification arrives over the WebSocket.
 *
 * The primary source is src/assets/sounds/notification.mp3, a short two-tone "ding". If the file
 * fails to load or decode, the same tones are synthesised with the Web Audio API so a notification
 * is never silent purely because of an asset problem.
 *
 * Browsers block audio until the user has interacted with the page, so playback is unlocked on the
 * first gesture; calls made before that are simply dropped.
 */

import notificationSoundUrl from '../assets/sounds/notification.mp3'

const CHIME = {
  /** Must match the two tones baked into the mp3 so the fallback is indistinguishable. */
  tones: [
    { frequency: 880, offset: 0, duration: 0.2 },
    { frequency: 1174.66, offset: 0.12, duration: 0.3 },
  ],
  peakGain: 0.18,
}

let audio = null
let audioReady = false
let audioContext = null

function getAudio() {
  if (typeof window === 'undefined') return null
  if (!audio) {
    audio = new Audio(notificationSoundUrl)
    audio.preload = 'auto'
    audio.volume = 0.5
    audio.addEventListener('canplaythrough', () => {
      audioReady = true
    })
    audio.addEventListener('error', () => {
      audioReady = false
    })
    audio.load()
  }
  return audio
}

function getAudioContext() {
  if (typeof window === 'undefined') return null

  const Ctor = window.AudioContext || window.webkitAudioContext
  if (!Ctor) return null

  if (!audioContext) {
    audioContext = new Ctor()
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {})
  }
  return audioContext
}

/**
 * Unlocks audio on the first user gesture so later pushes are audible. The element is played
 * muted at zero volume, which satisfies the browser autoplay policy without emitting a sound.
 */
export function primeNotificationSound() {
  const element = getAudio()
  if (element) {
    const previousVolume = element.volume
    element.muted = true
    element.volume = 0
    const played = element.play()
    if (played && typeof played.catch === 'function') {
      played
        .catch(() => {})
        .finally(() => {
          element.pause()
          element.muted = false
          element.volume = previousVolume
        })
    } else {
      element.pause()
      element.muted = false
      element.volume = previousVolume
    }
  }
  getAudioContext()
}

function playSynthesisedChime() {
  const context = getAudioContext()
  if (!context || context.state !== 'running') return

  const now = context.currentTime + 0.01
  for (const { frequency, offset, duration } of CHIME.tones) {
    const startAt = now + offset
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, startAt)

    // Short attack, exponential decay — reads as a "ding" rather than a beep.
    gain.gain.setValueAtTime(0.0001, startAt)
    gain.gain.exponentialRampToValueAtTime(CHIME.peakGain, startAt + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(startAt)
    oscillator.stop(startAt + duration + 0.02)
  }
}

export function playNotificationSound() {
  const element = getAudio()
  if (element && audioReady) {
    try {
      element.currentTime = 0
      const played = element.play()
      if (played && typeof played.catch === 'function') {
        played.catch(() => playSynthesisedChime())
      }
      return
    } catch {
      // Fall through to the synthesised chime.
    }
  }
  playSynthesisedChime()
}

export default playNotificationSound
