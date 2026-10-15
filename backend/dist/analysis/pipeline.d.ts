export interface PipelineJobInput {
    analysisId: string;
    ownerId: string;
    assetId: string;
    assetType: any;
    assetCriticality: any;
    inspectionType: any;
    contextNotes?: string;
    compareWithPrevious: boolean;
    mediaBuffer: Buffer;
    mimeType: string;
    originalFileName: string;
    isSimulated?: boolean;
}
export declare class InspectionPipeline {
    private activeJobs;
    enqueue(jobInput: PipelineJobInput): void;
    execute(job: PipelineJobInput): Promise<void>;
    recoverOrphanedAnalyses(): Promise<void>;
}
export declare const pipeline: InspectionPipeline;
//# sourceMappingURL=pipeline.d.ts.map