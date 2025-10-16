import { uploadAgeCSVToFirebase } from './uploadAgeData'
import { uploadEducationCSVToFirebase } from './uploadEducationData'
import { uploadOccupationCSVToFirebase } from './uploadOccupationData'
import { uploadSexCSVToFirebase } from './uploadSexData'
import { uploadCivilStatusCSVToFirebase } from './uploadCivilStatusData'
import { uploadMajorDestinationCSVToFirebase, uploadAllDestinationCSVToFirebase } from './uploadDestinationData'
import { uploadRegionCSVToFirebase, uploadProvinceCSVToFirebase } from './uploadOriginData'

export type DataType = 'age' | 'education' | 'occupation' | 'sex' | 'civilStatus' | 'majorDestination' | 'allDestination' | 'region' | 'province'

export interface UploadConfig {
  title: string
  description: string
  requirements: string[]
  uploadFunction: (file: File) => Promise<{ message: string }>
}

export const uploadConfigs: Record<DataType, UploadConfig> = {
  age: {
    title: 'Age Data',
    description: 'Upload emigrant age data',
    requirements: [
      'Must have "AGE_GROUP" column',
      '14 age groups required',
      'Year columns must be numeric',
      'All values must be numbers'
    ],
    uploadFunction: uploadAgeCSVToFirebase
  },
  civilStatus: {
    title: 'Civil Status Data',
    description: 'Upload emigrant civil status data',
    requirements: [
      'Must have "YEAR" column',
      '7 civil status categories required',
      'Year columns must be numeric',
      'All values must be numbers'
    ],
    uploadFunction: uploadCivilStatusCSVToFirebase
  },
  majorDestination: {
    title: 'Major Destination',
    description: 'Upload major destination data (1981-2020)',
    requirements: [
      'Must have YEAR column',
      '11 major country columns required',
      'Years from 1981-2020'
    ],
    uploadFunction: uploadMajorDestinationCSVToFirebase
  },
  allDestination: {
    title: 'All Destinations',
    description: 'Upload all destination countries (1981-2020)',
    requirements: [
      'Must have COUNTRY column',
      'Year columns (1981-2020)',
      '~175 countries'
    ],
    uploadFunction: uploadAllDestinationCSVToFirebase
  },
  education: {
    title: 'Education Data',
    description: 'Upload emigrant education data',
    requirements: [
      'Must have "EDUCATIONAL ATTAINMENT" column',
      '14 education levels required',
      'Year columns must be numeric',
      'All values must be numbers'
    ],
    uploadFunction: uploadEducationCSVToFirebase
  },
  occupation: {
    title: 'Occupation Data',
    description: 'Upload emigrant occupation data (1981-2020)',
    requirements: [
      'Must have "Occupation" column',
      '14 occupation types required',
      'Year columns (1981-2020)'
    ],
    uploadFunction: uploadOccupationCSVToFirebase
  },
  sex: {
    title: 'Sex Data',
    description: 'Upload emigrant sex data (1981-2020)',
    requirements: [
      'Must have YEAR, MALE, FEMALE columns',
      'Years from 1981-2020',
      'All values must be numbers'
    ],
    uploadFunction: uploadSexCSVToFirebase
  },
  region: {
    title: 'Origin (Region)',
    description: 'Upload emigrant origin data by region',
    requirements: [
      'Must have "REGION" column',
      '17 regions required',
      'Year columns (1988-2020)',
      'All values must be numbers'
    ],
    uploadFunction: uploadRegionCSVToFirebase
  },
  province: {
    title: 'Origin (Province)',
    description: 'Upload emigrant origin data by province',
    requirements: [
      'Must have "PROVINCE" column',
      '82 provinces required',
      'Year columns (1988-2020)',
      'All values must be numbers'
    ],
    uploadFunction: uploadProvinceCSVToFirebase
  }
}