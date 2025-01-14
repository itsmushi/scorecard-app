import i18n from '@dhis2/d2-i18n'
import {Button, ButtonStrip, colors, Input, Tooltip} from "@dhis2/ui";
import {IconButton, withStyles} from "@material-ui/core";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LinkIcon from "@material-ui/icons/Link";
import UnlinkIcon from "@material-ui/icons/LinkOff";
import {cloneDeep, find, findIndex, flattenDeep, head, isEmpty, last,} from "lodash";
import PropTypes from "prop-types";
import React, {useCallback, useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {useRecoilState, useRecoilValue} from "recoil";
import ScorecardIndicator from "../../../../../../../../../../core/models/scorecardIndicator";
import ScorecardIndicatorGroup from "../../../../../../../../../../core/models/scorecardIndicatorGroup";
import ScorecardIndicatorHolder from "../../../../../../../../../../core/models/scorecardIndicatorHolder";
import {
    ScorecardConfigEditState,
    ScorecardConfigStateSelector,
} from "../../../../../../../../../../core/state/scorecard";
import {updateListFromDragAndDrop} from "../../../../../../../../../../shared/utils/dnd";
import {generateLegendDefaults} from "../../../../../../../../../../shared/utils/utils";
import DataSourceHolder from "../DataSourceHolder";
import DataSourceSelectorModal from "../DataSourceSelectorModal";
import {customChunk} from "./utils";


const Accordion = withStyles({
    root: {
        border: "1px solid rgba(0, 0, 0, .125)",
        boxShadow: "none",
        "&:not(:last-child)": {
            borderBottom: 0,
        },
        "&:before": {
            display: "none",
        },
        "&$expanded": {
            margin: "auto",
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        background: "#F8F9FA",
        borderBottom: "1px solid rgba(0, 0, 0, .125)",
        marginBottom: -1,
        minHeight: 56,
        "&$expanded": {
            minHeight: 56,
        },
    },
    content: {
        "&$expanded": {
            margin: "12px 0",
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);

function LinkingContainer({
                              chunk,
                              onDataSourceDelete,
                              onLink,
                              onUnlink,
                              dataHolders,
                          }) {
    const linkable = chunk.length > 1;
    const hasLink = head(chunk)?.dataSources?.length > 1;

    const getIndex = useCallback(
        (id) => {
            return findIndex(dataHolders, ["id", id]);
        },
        [chunk]
    );
    const onLinkClick = () => {
        const indexOfMergedHolder = getIndex(head(chunk)?.id);
        const indexOfDeletedHolder = getIndex(last(chunk)?.id);
        onLink(indexOfMergedHolder, indexOfDeletedHolder);
    };

    const onUnlinkClick = () => {
        onUnlink(head(chunk).id);
    };

    const onIconClick = () => {
        hasLink ? onUnlinkClick() : onLinkClick();
    };

    return (
        <div className="linking-container">
            <div className="row align-items-center">
                <div className="column">
                    {chunk?.map((source) => (
                        <DataSourceHolder
                            onUnlink={onUnlinkClick}
                            dataHolder={source}
                            onDelete={onDataSourceDelete}
                            key={source.id}
                            id={source.id}
                            index={getIndex(source.id)}
                        />
                    ))}
                </div>
                <div className="link-button-container">
                    <Tooltip
                        content={i18n.t('Click to {{linkAction}}', {linkAction: hasLink ? i18n.t('unlink') : i18n.t('link')})}>
                        <IconButton onClick={onIconClick} disabled={!linkable && !hasLink}>
                            {(linkable || hasLink) &&
                            (hasLink ? (
                                <UnlinkIcon className="link-button"/>
                            ) : (
                                <LinkIcon className="link-button"/>
                            ))}
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}

LinkingContainer.propTypes = {
    chunk: PropTypes.array.isRequired,
    dataHolders: PropTypes.arrayOf(PropTypes.instanceOf(ScorecardIndicatorHolder))
        .isRequired,
    onDataSourceDelete: PropTypes.func.isRequired,
    onLink: PropTypes.func.isRequired,
    onUnlink: PropTypes.func.isRequired,
};

export default function DataGroup({
                                      handleAccordionChange,
                                      expanded,
                                      index,
                                      onDelete,
                                  }) {
    const [scorecardEditorState, setScorecardEditorState] =
        useRecoilState(ScorecardConfigEditState);
    const legendDefinitions = useRecoilValue(
        ScorecardConfigStateSelector("legendDefinitions")
    );
    const path = ["dataSelection", "dataGroups", index];
    const [group, setGroup] = useRecoilState(ScorecardConfigStateSelector(path));
    const {title, id, dataHolders} = group ?? new ScorecardIndicatorGroup();
    const [openAdd, setOpenAdd] = useState(false);
    const [titleEditOpen, setTitleEditOpen] = useState(false);
    const [titleEditValue, setTitleEditValue] = useState(title);

    const onLink = (indexOfMergedHolder, indexOfTheDeletedHolder) => {
        const dataSourceToLink = head(
            dataHolders[indexOfTheDeletedHolder]?.dataSources
        );
        const mergedHolder =
            ScorecardIndicatorHolder.linkDataSource(dataHolders[indexOfMergedHolder], dataSourceToLink);
        const updatedHolderList = [...dataHolders];
        updatedHolderList.splice(indexOfMergedHolder, 1, mergedHolder);
        updatedHolderList.splice(indexOfTheDeletedHolder, 1);
        setGroup((prevState) =>
            ScorecardIndicatorGroup.set(prevState, "dataHolders", updatedHolderList)
        );
    };

    const onUnlink = (id) => {
        //get the linked holder by id
        const dataHolder = find(dataHolders, ["id", id]);
        const dataHolderIndex = findIndex(dataHolders, ["id", id]);
        //create a new holder for the last dataSource
        const newDataHolder = new ScorecardIndicatorHolder({
            dataSources: [last(dataHolder?.dataSources)],
        });
        const dataHolderToModify = cloneDeep(dataHolder);
        const modifiedDataHolder = ScorecardIndicatorHolder.set(
            dataHolderToModify,
            "dataSources",
            dataHolderToModify?.dataSources?.splice(0, 1)
        );
        const updatedHolderList = [...dataHolders];
        updatedHolderList.splice(dataHolderIndex, 1, modifiedDataHolder);
        updatedHolderList.splice(dataHolderIndex, 0, newDataHolder);
        setGroup((prevState) =>
            ScorecardIndicatorGroup.set(prevState, "dataHolders", updatedHolderList)
        );
    };

    const onDragEnd = (result) => {
        const {destination, source} = result || {};
        setGroup((prevState) =>
            ScorecardIndicatorGroup.set(
                prevState,
                "dataHolders",
                updateListFromDragAndDrop(
                    prevState?.dataHolders,
                    source?.index,
                    destination?.index
                )
            )
        );
        setScorecardEditorState((prevState) => {
            if (prevState.selectedDataHolderIndex === source?.index) {
                return {
                    ...prevState,
                    selectedDataHolderIndex: destination?.index,
                };
            }
            return prevState;
        });
    };

    const onDataSourceAdd = (addedDataSources) => {
        //Assigns each of the selected indicator to its own holder
        const newDataSources = addedDataSources.map(
            (dataSource) =>
                new ScorecardIndicatorHolder({
                    dataSources: [
                        new ScorecardIndicator({
                            ...dataSource,
                            label: dataSource.displayName,
                            legends: generateLegendDefaults(legendDefinitions, 100),
                        }),
                    ],
                })
        );
        const updatedDataSources = [...dataHolders, ...newDataSources];
        setGroup((prevState) =>
            ScorecardIndicatorGroup.set(prevState, "dataHolders", updatedDataSources)
        );
    };

    const onExpand = (event, newExpanded) => {
        if (newExpanded) {
            setScorecardEditorState((prevState) => ({
                ...prevState,
                selectedDataHolderIndex: undefined,
                selectedGroupIndex: index,
            }));
        }
        handleAccordionChange(id)(event, newExpanded);
    };

    const onDataSourceDelete = (deletedDataSourceIndex) => {
        try {
            if (
                scorecardEditorState.selectedDataHolderIndex === deletedDataSourceIndex
            ) {
                setScorecardEditorState((prevState) => ({
                    ...prevState,
                    selectedDataHolderIndex: undefined,
                }));
            }
            const updatedDataSources = cloneDeep(dataHolders) || [];
            if (!isEmpty(updatedDataSources)) {
                updatedDataSources.splice(deletedDataSourceIndex, 1);
                setGroup((prevState) =>
                    ScorecardIndicatorGroup.set(
                        prevState,
                        "dataHolders",
                        updatedDataSources
                    )
                );
            }
        } catch (e) {
            console.log(e);
        }
    };

    const onTitleEditSubmit = (_, event) => {
        event.stopPropagation();
        if (isEmpty(titleEditValue.trim())) {
            setTitleEditValue(title);
            setTitleEditOpen(false);
        } else {
            setGroup((prevState) =>
                ScorecardIndicatorGroup.set(prevState, "title", titleEditValue)
            );
            setTitleEditOpen(false);
        }
    };

    const dataHolderChunks = customChunk(dataHolders);
    const selectedDataSourcesIds = flattenDeep(
        dataHolders.map(({dataSources}) => dataSources)
    ).map(({id}) => id);

    return (
        <Draggable index={index} draggableId={id}>
            {(provided) => (
                <Accordion
                    innerRef={provided.innerRef}
                    onDoubleClick={(event) => event.stopPropagation()}
                    expandIcon={<ExpandMoreIcon/>}
                    square
                    expanded={expanded === id}
                    onChange={onExpand}
                >
                    <AccordionSummary
                        onClick={(event) => event.stopPropagation()}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        expandIcon={<ExpandMoreIcon data-test="scorecard-group-expand"/>}
                        aria-controls={`${id}d-content`}
                        id={`${id}d--header`}
                        data-test="scorecard-group-item"
                    >
                        {titleEditOpen ? (
                            <div className="row space-between w-100">
                                <div
                                    onClick={(event) => event.stopPropagation()}
                                    className="column"
                                >
                                    <Input
                                        initialFocus
                                        value={titleEditValue}
                                        onChange={({value}) => setTitleEditValue(value)}
                                    />
                                </div>
                                <div className="column ">
                                    <ButtonStrip end>
                                        <Button onClick={onTitleEditSubmit} primary>
                                            {i18n.t('Save')}
                                        </Button>
                                        <Button
                                            onClick={(_, event) => {
                                                event.stopPropagation();
                                                setTitleEditOpen(false);
                                                setTitleEditValue(title);
                                            }}
                                        >
                                            {i18n.t('Cancel')}
                                        </Button>
                                    </ButtonStrip>
                                </div>
                            </div>
                        ) : (
                            <div className="row space-between align-items-center">
                                <div className="row align-items-center accordion-title-container">
                                    <p
                                        onDoubleClick={(event) => {
                                            event.stopPropagation();
                                            setTitleEditOpen(true);
                                        }}
                                        onClick={(event) => event.stopPropagation()}
                                        className="accordion-title"
                                    >
                                        {title}
                                    </p>
                                    <IconButton
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setTitleEditOpen(true);
                                        }}
                                        size="small"
                                        className="accordion-title-edit"
                                    >
                                        <EditIcon/>
                                    </IconButton>
                                </div>
                                <Button
                                    onClick={(_, event) => {
                                        event.stopPropagation();
                                        if (onDelete) {
                                            onDelete(id);
                                        }
                                    }}
                                    icon={<DeleteIcon/>}
                                >
                                    {i18n.t('Delete')}
                                </Button>
                            </div>
                        )}
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="column">
                            {isEmpty(dataHolders) ? (
                                <div
                                    className="column w-100 text-center center"
                                    style={{height: 100}}
                                >
                                    <p style={{color: colors.grey600}}>{i18n.t('Add a data source')}</p>
                                </div>
                            ) : (
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId={id}>
                                        {(provided) => (
                                            <div
                                                className="w-100"
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                            >
                                                {dataHolderChunks?.map((chunk, i) => (
                                                    <LinkingContainer
                                                        dataHolders={dataHolders}
                                                        onUnlink={onUnlink}
                                                        onLink={onLink}
                                                        chunk={chunk}
                                                        chunkIndex={i}
                                                        onDataSourceDelete={onDataSourceDelete}
                                                        key={`${i}-linking-container-${group?.id}`}
                                                    />
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            )}
                            <div>
                                <Button
                                    dataTest={"scorecard-indicator-add"}
                                    onClick={() => setOpenAdd(true)}
                                    icon={<AddIcon/>}
                                >
                                    {i18n.t('Add Item')}
                                </Button>
                            </div>
                        </div>
                        {openAdd && (
                            <DataSourceSelectorModal
                                disabled={selectedDataSourcesIds}
                                onSelect={onDataSourceAdd}
                                onClose={() => setOpenAdd(false)}
                                open={openAdd}
                            />
                        )}
                    </AccordionDetails>
                </Accordion>
            )}
        </Draggable>
    );
}

DataGroup.propTypes = {
    index: PropTypes.number.isRequired,
    expanded: PropTypes.string,
    handleAccordionChange: PropTypes.func,
    onDelete: PropTypes.func,
};
