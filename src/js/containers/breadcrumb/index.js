import { connect } from 'react-redux';
import Breadcrumb from 'components/breadcrumb';
import { breadcrumbItemsSelector } from 'selectors/breadcrumbs';


function mapStateToProps(state, ownProps) {
  return {
    breadcrumbItems: breadcrumbItemsSelector(state, ownProps),
  };
}

export default connect(mapStateToProps)(Breadcrumb);
