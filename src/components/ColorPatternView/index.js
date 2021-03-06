import React, {Component} from 'react'
import {connect} from 'cerebral/react'
import * as PIXI from 'pixi.js'
import Canvas from '../Canvas'
import './styles.css'

export default connect(
  {
    initialValues: 'colorPatternViewModule.initialValues',
    allItemsColors: 'colorPatternEditModule.allItemsColors',
    colors: 'colorPatternEditModule.colors'
  },
  {
    redirectTo: 'homeModule.redirectTo'
  },
  class ColorPatternView extends Component {
    constructor (props) {
      super(props)
      this.state = Object.assign({
        isPlaying: false,
        mustRedrawGrid: false
      }, this.props.initialValues)
    }

    componentDidMount () {
      this.keyDownListener = (e) => {
        if (e.code === 'Escape') {
          this.props.redirectTo({destination: 'colorPatternEdit'})
        } else {
          console.info(e.code)
        }
      }
      window.addEventListener('keydown', this.keyDownListener)
    }

    componentWillUnmount () {
      window.removeEventListener('keydown', this.keyDownListener)
    }

    _drawGrid () {
      const ctx = this.state.ctx
      ctx.myGraphics = new PIXI.Graphics()

      // draw a shape
      const squareSize = ctx.canvasSize.width / this.state.gridSize
      this._renderSquaresAllCanvas(ctx, squareSize)
      // window.ctx = ctx
      ctx.stage.addChild(ctx.myGraphics)

      this.setState({isPlaying: true})
    }

    _renderSquaresAllCanvas (ctx, size) {
      const maxHeight = ctx.canvasSize.height
      for (let i = 0; size * i < maxHeight; i++) {
        this._fullRow(ctx, size, size * i, i)
      }
    }

    _fullRow (ctx, width, startOnHeight, rowIndex) {
      const maxLength = ctx.canvasSize.width
      let startPoint = [0, startOnHeight]
      let endPoint = [width, width + startOnHeight]
      let columnIndex = 0
      while (startPoint[0] < maxLength) {
        this._drawSquare(ctx, startPoint, endPoint, rowIndex, columnIndex)
        startPoint[0] += width
        endPoint[0] += width
        columnIndex++
      }
    }

    _drawSquare (ctx, initial, final, rowIndex, colIndex) {
      // set a fill and line style
      if (this.state.gridSize <= 10) {
        ctx.myGraphics.lineStyle(1, 0x6666ee, 1)
      }

      const maxRows = this.props.allItemsColors.length
      const maxColumns = this.props.allItemsColors[0].length
      const colorIndex = this.props.allItemsColors[rowIndex % maxRows][colIndex % maxColumns]
      const currentFillColor = this.props.colors[colorIndex % this.props.colors.length]
      ctx.myGraphics.beginFill(currentFillColor)
      // ctx.myGraphics.beginFill(0x333399)
      ctx.myGraphics.moveTo(...initial)
      ctx.myGraphics.lineTo(final[0], initial[1])
      ctx.myGraphics.lineTo(...final)
      ctx.myGraphics.lineTo(initial[0], final[1])
      ctx.myGraphics.lineTo(...initial)
      ctx.myGraphics.endFill()
    }

    _onStart ({ctx}) {
      this.setState({ctx}, () => {
        ctx.stage = new PIXI.Container()
        if (this.props.allItemsColors.length > 0) {
          this._drawGrid(ctx)
        }
      })
    }

    _onAnimate (ctx) {
      if (this.state.mustRedrawGrid) {
        ctx.myGraphics.destroy()
        this._drawGrid(ctx)
        this.setState({
          mustRedrawGrid: false
        })
      } else {
        if (ctx.stage) {
          ctx.stage.scale.x = this.state.zoomLevel
          ctx.stage.scale.y = this.state.zoomLevel
        }
      }
    }

    render () {
      return (
        <div id='pattern-viewer-container'>
          <div className='bodyContent'>
            <div className='canvasContainer'>
              <Canvas
                zoomLevel={1}
                backgroundColor={0x333333}
                onStart={(ctx) => this._onStart(ctx)}
                isPlaying={this.state.isPlaying}
                onAnimate={(ctx) => this._onAnimate(ctx)}
              />
            </div>

            <div className='controlsContainer'>
              <a className='linkItem' href='/colorPatternEdit'>
                Edit
              </a>

              <div className='inputContainer'>
                <label htmlFor='gridSize'>
                  Zoom level:
                </label>
                <span>
                  {this.state.zoomLevel}
                </span>
                <input
                  id='zoomLevel'
                  type='range'
                  min={1}
                  max={10}
                  step={1}
                  value={this.state.zoomLevel}
                  onChange={(e) => {
                    this.setState({
                      zoomLevel: Number(e.target.value),
                      mustRedrawGrid: false
                    })
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      )
    }
  }
)
