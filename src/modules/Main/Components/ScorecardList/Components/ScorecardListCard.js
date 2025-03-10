import {useAlert} from "@dhis2/app-runtime";
import i18n from '@dhis2/d2-i18n'
import {Button, ButtonStrip, colors} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {useHistory} from "react-router-dom";
import holderImage from '../../../../../resources/images/img.png'
import DeleteConfirmation from "../../../../../shared/Components/DeleteConfirmation";
import {useDeleteScorecard} from "../../../../../shared/hooks/datastore/useScorecard";

export default function ScorecardListCard({scorecard}) {
    const {title, description, id} = scorecard
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const history = useHistory()
    const {remove} = useDeleteScorecard(id)
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}))

    const onView = () => {
        history.push(`/view/${id}`, {from: 'home'})
    }

    const onEdit = () => {
        history.push(`/edit/${id}`, {from: 'home'})
    }

    const onDelete = async () => {
        try{
           await remove()
        } catch (e){
            show({
                message: e.message,
                type: {info: true}
            })
        }
        setDeleteConfirmOpen(false)
        show({
            message: i18n.t('Scorecard deleted successfully'),
            type: {success: true}
        })

    }

    return (
        <div className='container-bordered p-32' style={{margin: 16, background: 'white'}}>
            <div className='row space-between align-items-center'>
                <div className='row'>
                    <img alt='img' src={holderImage} style={{height: 100, width: 200, paddingRight: 32}}/>
                   <div className='column start'>
                       <h3>{title}</h3>
                       <p style={{color: colors.grey600, margin: 0}}>{description}</p>
                   </div>
                </div>
                <div className='row end'>
                    <ButtonStrip middle>
                        <Button onClick={onView} primary>{i18n.t('View')}</Button>
                        <Button onClick={onEdit}>{i18n.t('Edit')}</Button>
                        <Button onClick={() => setDeleteConfirmOpen(true)} destructive>{i18n.t('Delete')}</Button>
                    </ButtonStrip>
                    {
                        deleteConfirmOpen &&
                        <DeleteConfirmation component={<p>{i18n.t('Are you sure you want to delete scorecard')}:<b>{title}</b></p>} onConfirm={onDelete}
                                            onCancel={() => setDeleteConfirmOpen(false)}/>
                    }
                </div>
            </div>
        </div>
    )
}

ScorecardListCard.propTypes = {
    scorecard: PropTypes.object
};

