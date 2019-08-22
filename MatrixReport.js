class MatrixReport {

	var m_store_id = Config.MatrixReport.ProjectId;
	//var m_factory;
	var m_store; // store = survey
	var m_record; // record = response record
	var m_report;
	var m_state;
	var m_qm;
	var m_user;
  	var m_id; // Key
  	var m_confirmit;
  	var m_node_id; // Current Node ID being processed
  	var m_selected;

	function MatrixReport( confirmit, report, state, user, node_id ) {
      	m_report = report;
		m_state = state;
		m_user = user;
      	m_confirmit = confirmit;

        m_store =  HayGroup.ReportUtil.Persistence.DataStores[ m_store_id ];

        m_node_id = (node_id == null) ? NodeId() : node_id; // pick up value from Parameter (NODE_ID), or use value passed 
      	m_id = m_node_id;

		m_record = m_store[ m_id ];
		m_qm = QueryManager.GetQueryManagerMainMX(report, state, user, true);
      
      	//m_selected = ParamUtil.Selected (report, state, 'MATRIX_DIMENSIONS_PAGED', user);
      
    }
  
    function TopNodeId() {
       return m_user.PersonalizedReportBase;
    }	

	function Id() {
		return m_id;
	}
	
	function NodeId() {
		return ParamUtil.GetParamCode (m_state, 'NODE_ID');	
	}
	
	function Record() {
		return m_record;
	}
	
	function NodeLabel() {
		var label = DatabaseQuery.Exec (
		  m_confirmit, 
		  Config.Hierarchy.SchemaId, 
		  Config.Hierarchy.TableName, 
		  '__l9',
		  'id', 
		  m_node_id
		);	
		return ('' + label);
	}
  
	function TimeStamp() {
		return new Date().getTime().toString();
	}
	
	function ParticipationData() {
		var row1 = m_report.TableUtils.GetRowValues('RESPONSE_RATE', 1); 
		var n = row1[row1.length-3].Value;
		var population = row1[row1.length-2].Value;
		var response_rate = row1[row1.length-1].Value;
		return {
			N: Format (n),
			Population: Format (population),
			ResponseRate: TableContent.isNotANumber (response_rate) ? '-' : (Math.round (100*n/population) + '%')
		};
	}
	
	function Format (value) {
		return TableContent.isNotANumber (value) ? '-' : value;
	}
	
	function SaveParticipation() {

		var pd = ParticipationData();

		m_record [ 'N' ] = pd.N;
		m_record [ 'POPULATION' ] = pd.Population;
		m_record [ 'RESPONSE_RATE' ] = pd.ResponseRate;

   }
	
	function SaveControlData() {
		
		// Update Meta Data store
		var project_id = m_report.DataSource.GetProject('ds0').ProjectId;
		var control = MatrixReportMetaDataStore.Record ( project_id, Config.MatrixReport.ProjectId );
		control [ 'UPDATED' ] = TimeStamp();
		control [ 'LAST_PROCESSED_ID' ] = m_node_id; // NodeId();
          
        MatrixReportMetaDataStore.Get().Flush();
	
	}
	
	function Save() {

      	
		m_record [ 'UPDATED' ] = TimeStamp();

      	// Only save some of the data if this is the first iteration of the branch
        //if (m_selected.Code == '0') {
              m_record [ 'BRANCH' ] = NodeLabel();	
              SaveParticipation();
        //}

      	SaveItems();
      	SaveDimensions();
      	m_store.Flush();
		SaveControlData();
	}

	function SaveItems() {
      	var qs = m_qm.GetAllQuestions();
      
      	//Iterate over all questions and add them to MX record
      	for(var i = 0; i<qs.length; i++){
      		var qno = LookupTable.GetQuestionNumberByQuestionId (qs[i].GetId());
          	m_record['Q_' + qno] = qs[i].GetScores().fav;
          	m_record['Q_NEU_' + qno] = qs[i].GetScores().neu;
          	m_record['Q_UNFAV_' + qno] = qs[i].GetScores().unfav;
          	m_record['Q_TREND1_' + qno] = qs[i].internalComps[5].GetScore(true);
        }
	}
	
	function SaveDimensions() {
      	var dims = m_qm.GetAllDimensions();
      	for(var i = 0; i<dims.length; i++){
      		m_record['D_' + (i+1)] = dims[i].GetScores().fav;
          	m_record['D_NEU_' + (i+1)] = dims[i].GetScores().neu;
          	m_record['D_UNFAV_' + (i+1)] = dims[i].GetScores().unfav;
          	m_record['D_TREND1_' + (i+1)] = dims[i].internalComps[5].GetScore(true);
        }
	}
	
}