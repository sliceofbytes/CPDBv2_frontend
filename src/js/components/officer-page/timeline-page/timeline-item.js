import React, { PropTypes, Component, createElement } from 'react';
import { Motion, spring } from 'react-motion';

import { TimelineItemType } from 'utils/constants';
import { slower } from 'utils/spring-presets';
import Hoverable from 'components/common/higher-order/hoverable';
import CrItem from './cr-item';
import YearItem from './year-item';
import UnitItem from './unit-item';
import JoinedItem from './joined-item';
import { wrapperStyle } from './timeline-item.style';


export class TimelineItem extends Component {
  constructor(props) {
    super(props);
    this.contentMap = {
      [TimelineItemType.CR]: CrItem,
      [TimelineItemType.YEAR]: YearItem,
      [TimelineItemType.JOINED]: JoinedItem,
      [TimelineItemType.UNIT]: UnitItem
    };
    this.handleContentRef = this.handleContentRef.bind(this);
  }

  componentDidMount() {
    const { selected, onSelected } = this.props;
    if (selected) {
      const { top } = this.element.getBoundingClientRect();
      onSelected(top);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected && !this.props.selected) {
      const { top } = this.element.getBoundingClientRect();
      this.props.onSelected(top);
    }
  }

  handleContentRef(el) {
    this.element = el;
  }

  renderContent({ ratio }) {
    const { item, hovering, minimapItemHovered, openBottomSheetWithComplaint, officerId } = this.props;
    const onClick = item.kind ===
      TimelineItemType.CR
      ? (crid) => openBottomSheetWithComplaint({ officerId, crid })
      : null;

    let child = null;
    if (this.contentMap[item.kind]) {
      child = createElement(this.contentMap[item.kind], { item, hovering, onClick, flashRatio: ratio });
    }

    return (
      <div className='test--card-item'
        style={ wrapperStyle(hovering || minimapItemHovered) } ref={ this.handleContentRef }>
        { child }
      </div>
    );
  }

  render() {
    const { flash } = this.props;
    if (flash) {
      return (
        <Motion style={ { ratio: spring(1, slower()) } } defaultStyle={ { ratio: 0 } }>
          { this.renderContent.bind(this) }
        </Motion>
      );
    }
    return this.renderContent({ ratio: null });
  }
}

TimelineItem.propTypes = {
  item: PropTypes.object,
  hovering: PropTypes.bool,
  onSelected: PropTypes.func,
  selected: PropTypes.bool,
  minimapItemHovered: PropTypes.bool,
  flash: PropTypes.bool,
  officerId: PropTypes.number,
  openBottomSheetWithComplaint: PropTypes.func
};

TimelineItem.defaultProps = {
  item: {}
};

export default Hoverable(TimelineItem);