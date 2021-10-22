/* Text */
const textInput = document.querySelector( '#text-input' );
const textMirror= document.querySelector( '#text-mirror' );
/* Audio */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioCtx.createGain();
gainNode.gain.setTargetAtTime( 0.2, audioCtx.currentTime, 0.1); 
gainNode.connect( audioCtx.destination );
const filter = audioCtx.createBiquadFilter();
filter.frequency.setTargetAtTime( 2500, audioCtx.currentTime, 0.1); 
filter.connect( gainNode );


var line = [];

let waves = ['sine', 'triangle', 'square', 'sawtooth'];
var detune = 0;
var filterCut = 2500;
var filterRes= 2;

textInput.addEventListener( 'input', function ( e ) {
    textMirror.value = e.target.value; 
} );

textInput.addEventListener( 'keydown', function ( e ) {
    let key = e.keyCode;

   
    let freq = mapping( 222, key, 1000, 60 );

    let randomWave = getRandomValue( 0, 4 );

    var wave = waves[ randomWave];

    let randomDur = getRandomValue( 0.3, 5 );

    let osc = createOsc( audioCtx, freq , detune, wave, randomDur );

    if( detune < 500 ) {
        detune += 3;
    } else {
        let randomVal = getRandomValue( 1.5, 3 );
        detune = detune / randomVal;
    }

    if( filterCut < 4000 ) {
        filterCut += 30;
        filter.frequency.exponentialRampToValueAtTime( filterCut, audioCtx.currentTime + 0.1 ); 
    } else {
        let randomVal = getRandomValue( 1.5, 2.1 );
        filterCut = filterCut / randomVal;
        filter.frequency.exponentialRampToValueAtTime( filterCut, audioCtx.currentTime + 30 ); 
    }

    if( filterRes < 20 ) {
        filterRes += 0.5;
        filter.Q.exponentialRampToValueAtTime( filterRes, audioCtx.currentTime + 0.1 ); 
    } else {
        let randomVal = getRandomValue( 1.5, 2.1 );
        filterRes = filterRes / randomVal;
        filter.Q.exponentialRampToValueAtTime( filterRes + 0.1, audioCtx.currentTime + 10 );
    }
  

} );


/* Create oscillator */
function createOsc( ctx, freq, det, wave, dur ) {
    let osc = ctx.createOscillator();
    
    osc.frequency.setValueAtTime( freq, audioCtx.currentTime ); 
    osc.detune.setValueAtTime( det, audioCtx.currentTime );
    osc.type = wave;
    
    let oscGain = ctx.createGain();
    oscGain.gain.value = 0.06;
    oscGain.connect( filter );

    osc.connect( oscGain );
    osc.start();

    oscGain.gain.linearRampToValueAtTime( 0, ctx.currentTime + (dur - 0.1) );
    osc.stop( ctx.currentTime + dur );

    return osc;
}

/* Gneral function for mapping values between range */
function mapping( total, input, max, min ) {
    return  (input / total) * ( max - min ) + min;
}

/* Randomizer */
/* min (incluido) y max (excluido) */
function getRandomValue( min, max ) {
    return Math.floor( Math.random() * ( max - min ) ) + min;
}