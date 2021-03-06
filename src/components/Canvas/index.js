/* globals requestAnimationFrame */

import React, {Component, PropTypes} from 'react'
import {connect} from 'cerebral/react'
// noinspection JSFileReferences
import * as PIXI from 'pixi.js'
import './styles.css'

export default connect({
  rotationSpeed: 'sunRotationModule.rotationSpeed'
},
  class Canvas extends Component {
    /**
     * Define our prop types
     **/
    static get propTypes () {
      return {
        zoomLevel: PropTypes.number.isRequired
      }
    }

    constructor (props) {
      super(props)

      // bind our animate function
      this.animate = this.animate.bind(this)
      // bind our zoom function
      this.updateZoomLevel = this.updateZoomLevel.bind(this)
      this.isPlaying = this.props.isPlaying || true
      this.stage = null
      this.clientSize = {
        width: 0,
        height: 0
      }
      this.canvasSize = {
        width: 0,
        height: 0
      }
    }

    /**
     * In this case, componentDidMount is used to grab the canvas container ref, and
     * and hook up the PixiJS renderer
     **/
    componentDidMount () {
      this.clientSize = {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
      }

      const MARGIN = 20
      const maxWidth = this.props.width || this.clientSize.width - MARGIN * 2
      const maxHeight = this.props.height || this.clientSize.height - MARGIN * 8
      const maxSize = Math.min(maxWidth, maxHeight)
      this.canvasSize = {
        width: maxSize,
        height: maxSize
      }

      this.renderer = PIXI.autoDetectRenderer(this.canvasSize.width, this.canvasSize.height, {
        backgroundColor: this.props.backgroundColor || 0xcccccc
      })
      this.refs.gameCanvas.appendChild(this.renderer.view)

      this.props.onStart({
        ctx: this
      })

      // start animating
      this.animate()
    }

    componentWillUnmount () {
      this.isPlaying = false
    }

    /**
     * shouldComponentUpdate is used to check our new props against the current
     * and only update if needed
     **/
    shouldComponentUpdate (nextProps, nextState) {
      // this is easy with 1 prop, using Immutable helpers make
      // this easier to scale

      return nextProps.zoomLevel !== this.props.zoomLevel
    }

    /**
     * When we get new props, run the appropriate imperative functions
     **/
    componentWillReceiveProps (nextProps) {
      this.updateZoomLevel(nextProps)
      if (nextProps.isPlaying === true) {
        this.isPlaying = nextProps.isPlaying
        this.animate()
      }
    }

    /**
     * Update the stage "zoom" level by setting the scale
     **/
    updateZoomLevel (props) {
      if (this.stage) {
        this.stage.scale.x = props.zoomLevel
        this.stage.scale.y = props.zoomLevel
      }
    }

    /**
     * Animation loop for updating Pixi Canvas
     **/
    animate () {
      // if (this.isPlaying === false || !this.stage) {
      //   return
      // }
      this.props.onAnimate(this)
      // render the stage container
      this.stage && this.renderer.render(this.stage)
      requestAnimationFrame(this.animate)
    }

    /**
     * Render our container that will store our PixiJS game canvas. Store the ref
     **/
    render () {
      return (
        <div id='canvas-container' ref='gameCanvas' />
      )
    }
  }
)

