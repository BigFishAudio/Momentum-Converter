import './KitInfo.css'
import React from 'react'
import { Stack } from 'office-ui-fabric-react/lib/Stack';

export class KitInfo extends React.Component {
    render() {
        const {
            files,
            instFilePath,
            kitId,
            kitName,
            kitSubtitle,
            samplesInDir,
        } = this.props

        const missingSamples = files.filter(f => !f.info).length
        const unmappedSamples = samplesInDir.length - files.length

        return (
            <div className="KitInfo">
                <Stack horizontal tokens={{childrenGap: 20}}>
                    <Stack.Item>
                        <div>Loaded instrument: {instFilePath && instFilePath.match(/[^\\/]*$/)}</div>
                        <div>
                            <span>Kit: {kitName} - {kitSubtitle} ({kitId})</span>
                        </div>
                    </Stack.Item>
                    <Stack.Item>
                        <div>Mapped samples: {files.length} {missingSamples && <span style={{color: 'red'}}>&nbsp;({missingSamples} missing!)</span>}</div>
                        <div>Found samples: {samplesInDir.length} {unmappedSamples > 0 && <span style={{color: 'red'}}>&nbsp;({unmappedSamples} unmapped!)</span>}</div>
                    </Stack.Item>
                </Stack>
            </div>
        )
    }
}