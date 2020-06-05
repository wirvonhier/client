import Component from 'vue-class-component';
import Styles from './verticalSwiper.scss';
import { VueComponent } from '@/ui/vue-ts-component';

type Swipe = {
  startX: number;
  lastX: number;
  startY: number;
  lastY: number;
  startTime: number;
};

interface IProps {
  class?: string;
  ref?: string;
}
@Component({})
export class VerticalSwiper extends VueComponent<IProps> {
  public translateY = 0;
  public activeIndex = 0;
  private swiping: Swipe | null = null;
  public finishTransition = false;

  public startSwiping(e: TouchEvent | MouseEvent): void {
    // only start swiping if the position at the top or bottom of the scrolled page
    const activeEl = this.$slots.default[this.activeIndex].elm;
    if (this.activeIndex === this.$slots.default.length - 1 && activeEl.scrollTop !== 0) {
      return;
    }
    const eventData = e instanceof MouseEvent ? e : e.changedTouches[0];
    this.swiping = {
      startX: eventData.pageX,
      lastX: eventData.pageX,
      startY: eventData.pageY,
      lastY: eventData.pageY,
      startTime: new Date().getTime(),
    };
    this.finishTransition = false;
  }

  public moveSwiping(e: TouchEvent | MouseEvent): void {
    if (this.swiping === null) {
      return;
    }
    const eventData = e instanceof MouseEvent ? e : e.changedTouches[0];
    this.swiping.lastX = eventData.pageX;
    this.swiping.lastY = eventData.pageY;
    const diff = this.getSwipeDiff(eventData);
    // Cannot scroll up on the first page or down on the last page
    if (
      (diff.Y > 0 && this.activeIndex === 0) ||
      (diff.Y < 0 && this.activeIndex + 1 === this.$slots.default?.length)
    ) {
      this.translateY = 0;
      this.swiping = null;
      return;
    } else if (Math.abs(diff.Y) > 20) {
      this.translateY = diff.Y;
    } else {
      this.translateY = 0;
    }
  }

  public endSwiping(e: TouchEvent | MouseEvent): boolean {
    if (this.swiping === null) {
      this.translateY = 0;
      return true;
    }
    const eventData = e instanceof MouseEvent ? e : e.changedTouches[0];
    const diff = this.getSwipeDiff(eventData);
    if (Math.abs(diff.Y) > 100) {
      this.activeIndex = Math.min(
        Math.max(0, diff.Y > 0 ? this.activeIndex - 1 : this.activeIndex + 1),
        this.$slots.default ? this.$slots.default.length : 0,
      );
      if (this.$slots.default) {
        this.$slots.default[this.activeIndex].context?.$emit('slideChange', true);
      }
      this.$emit('slideChange', true);
    }
    this.swiping = null;
    this.translateY = 0;
    this.finishTransition = true;
  }

  private getSwipeDiff(eventData: Touch | MouseEvent): { X: number; Y: number } {
    if (this.swiping === null) {
      return { X: 0, Y: 0 };
    }
    return {
      X: eventData.pageX - this.swiping.startX,
      Y: eventData.pageY - this.swiping.startY,
    };
  }

  public slideTo(index: number | undefined, _duration = 0): void {
    this.activeIndex =
      index === undefined || index < 0 || !this.$slots.default || index >= this.$slots.default.length ? 0 : index;
    this.$emit('slideChange', true);
  }

  // @ts-ignore: Declared variable is not read
  render(h: CreateElement): Vue.VNode {
    const translateY = this.translateY - window.innerHeight * this.activeIndex;
    return (
      <div
        onTouchstart={this.startSwiping.bind(this)}
        onTouchmove={this.moveSwiping.bind(this)}
        onTouchend={this.endSwiping.bind(this)}
        onMousedown={this.startSwiping.bind(this)}
        onMousemove={this.moveSwiping.bind(this)}
        onMouseup={this.endSwiping.bind(this)}
        class={`
          ${Styles['vertical-swiper']}
          ${this.finishTransition ? Styles['vertical-swiper--transition'] : ''}
        `}
        style={{ transform: `translateY(${translateY}px)` }}
      >
        {this.$slots.default}
      </div>
    );
  }
}
