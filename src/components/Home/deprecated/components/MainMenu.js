import React from 'react'
import style from './components.css'
import bus from '../bus'
import magnifier from './magnifier'

const names = ['Diller', 'Scofidio', 'Renfro']

const priority = 'aeioubcdfghjklmnpqrstvwxyz*'

function removeOne(strings) {
  const strCount = strings.length
  let best = {
    pri: Infinity,
    done: true
  }
  for (let i = 0; i < strCount; i++) {
    const str = strings[i]
    for (let j = 1; j < str.length; j++) {
      const pri = priority.indexOf(str[j].toLowerCase())
      if (pri < best.pri) {
        best = { pri, candidates: [{ i, j }] }
      } else if (pri === best.pri) {
        best.candidates.push({ i, j })
      }
    }
  }
  if (best.done) return null
  const pick = Math.floor(Math.random() * best.candidates.length)
  best = best.candidates[pick]
  const result = strings.slice()
  result[best.i] =
    strings[best.i].slice(0, best.j) + strings[best.i].slice(best.j + 1)
  return result
}

function buildVariants() {
  let reduced = names
  const variants = []
  while (reduced) {
    variants.push(reduced)
    reduced = removeOne(reduced)
  }
  return variants
}

export default class MainMenu extends React.Component {
  constructor() {
    super()
    this.fontSize = '38px'
    this.fontFamily = 'DSPLUSR'
    // this.fontFamily = 'Unica77 LL'
  }

  componentDidMount() {
    const variants = buildVariants()
    const strForVariant = v => `${v[0]} ${v[1]} + ${v[2]} ${v[3]} ${v[4]}`
    const ctx = document.createElement('canvas').getContext('2d')
    ctx.font = `${this.fontSize} ${this.fontFamily}`
    const baseline = ctx.measureText(strForVariant(variants[0])).width
    this.variants = []
    variants.reverse().forEach(variant => {
      this.variants.push({
        compression: baseline - ctx.measureText(strForVariant(variant)).width,
        strings: variant
      })
    })
    document.addEventListener('scroll', this.handleScroll)
    this.state = {
      variantIndex: this.variants.length - 1
    }
    bus.subscribe(this.handleBusMessage)
    this.reference = document.body.scrollTop
    this.handleScroll()
  }

  handleScroll = event => {
    if (document.body.scrollHeight == 0) return
    const y = document.body.scrollTop
    const fudgeScale = 0.65
    const desiredCompression = (y - this.reference) * fudgeScale
    if (desiredCompression < 0 || y <= 0) {
      this.reference = y
      this.setState({
        variantIndex: this.variants.length - 1
      })
      return
    }
    if (desiredCompression > this.variants[0].compression) {
      this.reference = y - this.variants[0].compression / fudgeScale
    }
    for (let i = 0; i < this.variants.length; i++) {
      if (this.variants[i].compression < desiredCompression) {
        this.setState({
          variantIndex: i
        })
        break
      }
    }
  }

  handleBusMessage = msg => {
    switch (msg.event) {
      case 'setScroll':
        this.reference = msg.y - (document.body.scrollTop - this.reference)
        break
      default:
        break
    }
  }

  render() {
    if (!this.variants) {
      return <div />
    }
    const strs = this.variants[this.state.variantIndex].strings.map(s =>
      s.toUpperCase()
    )

    let dsrLogo = (
      <span className={`${style.link} ${style.logo}`}>
        {strs[0]} {strs[1]} <span className={style.plus}>+</span> {strs[2]}
      </span>
    )
    if (strs[0].length == 1 && strs[1].length == 1 && strs[2].length == 1) {
      dsrLogo = (
        <span
          className={`${style.link} ${style.logoFullyCompact} ${style.logo}`}
        >
          DS<span className={style.plus}>+</span>R
        </span>
      )
    }
    return (
      <div>
        <div
          className={style.mainMenu}
          style={{ fontSize: this.fontSize, fontFamily: this.fontFamily }}
        >
          {dsrLogo}
          <span className={style.mainMenuLinks}>
            <span className={style.link}>{'PROJECTS'}</span>
            <span className={style.link}>{'ABOUT'}</span>
          </span>
        </div>
        <div
          className={style.magnifier}
          dangerouslySetInnerHTML={{ __html: magnifier }}
        />
      </div>
    )
  }
}
