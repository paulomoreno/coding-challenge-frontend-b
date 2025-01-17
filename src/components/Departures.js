import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import Container from 'react-bootstrap/Container';
import { Translate } from 'react-redux-i18n';
import InfiniteScroll from 'react-infinite-scroller';

import Departure from './Departure';
import Loader from './Loader';

import {
  initDepartures, pollDepartures, departuresSelector, isCompleteSelector, isLoadingSelector,
} from '../store/modules/departures';

const Departures = ({
  departures, isComplete, isLoading, initDeparturesConnect, pollDeparturesConnect,
}) => {
  useEffect(() => {
    initDeparturesConnect();
  }, []);

  const pollData = () => {
    if (!isComplete && !isLoading) {
      pollDeparturesConnect();
    }
  };

  return (
    <div role="main" aria-labelledby="departuresTitle">
      <InfiniteScroll
        pageStart={0}
        loadMore={pollData}
        hasMore={!isComplete}
        initialLoad={false}
        loader={(
          <div key="departureLoader" style={{ textAlign: 'center', clear: 'both' }}>
            <Loader />
          </div>
        )}
        useWindow={false}
      >
        <Container>
          <h1 className="mt-3 mb-4" id="departuresTitle"><Translate value="departures.title" /></h1>
          {departures.map(departure => (
            <Departure key={`departure_${departure.id}`} departure={departure} />
          ))}
          {isComplete && !isLoading && (
          <p style={{ textAlign: 'center' }}>
            <b><Translate value="departures.noMoreAvailable" /></b>
          </p>
          )}
        </Container>
      </InfiniteScroll>
    </div>
  );
};

Departures.propTypes = {
  departures: PropTypes.array,
  isComplete: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  initDeparturesConnect: PropTypes.func.isRequired,
  pollDeparturesConnect: PropTypes.func.isRequired,
};

Departures.defaultProps = {
  departures: [],
};

const mapStateToPropsSelector = createStructuredSelector({
  departures: departuresSelector,
  isComplete: isCompleteSelector,
  isLoading: isLoadingSelector,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    initDeparturesConnect: initDepartures,
    pollDeparturesConnect: pollDepartures,
  }, dispatch);
}

export default connect(mapStateToPropsSelector, mapDispatchToProps)(Departures);
